use std::collections::BTreeMap;
use std::fmt;

use tracing::field::{Field, Visit};
use tracing::{Level, Subscriber};
use tracing_subscriber::Layer;
use tracing_subscriber::layer::Context;
use tracing_subscriber::registry::LookupSpan;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn console_log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = info)]
    fn console_info(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = warn)]
    fn console_warn(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = error)]
    fn console_error(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = debug)]
    fn console_debug(s: &str);
}

/// Recorded fields from a span or event.
pub(crate) struct Fields {
    message: String,
    rest: BTreeMap<String, String>,
}

impl Fields {
    fn new() -> Self {
        Self {
            message: String::new(),
            rest: BTreeMap::new(),
        }
    }
}

impl Visit for Fields {
    fn record_debug(&mut self, field: &Field, value: &dyn fmt::Debug) {
        if field.name() == "message" {
            self.message = format!("{value:?}");
        } else {
            self.rest
                .insert(field.name().to_owned(), format!("{value:?}"));
        }
    }
}

/// A [`Layer`] that logs to the browser console with full span context.
///
/// Unlike `WasmLayer` from `wasm-tracing`, this includes span names and
/// fields in every event's console output.
pub struct ConsoleLayer {
    max_level: Level,
}

impl ConsoleLayer {
    pub fn new(max_level: Level) -> Self {
        Self { max_level }
    }
}

impl<S> Layer<S> for ConsoleLayer
where
    S: Subscriber + for<'a> LookupSpan<'a>,
{
    fn enabled(&self, metadata: &tracing::Metadata<'_>, _: Context<'_, S>) -> bool {
        metadata.level() <= &self.max_level
    }

    fn on_new_span(
        &self,
        attrs: &tracing::span::Attributes<'_>,
        id: &tracing::Id,
        ctx: Context<'_, S>,
    ) {
        let mut fields = Fields::new();
        attrs.record(&mut fields);

        if let Some(span_ref) = ctx.span(id) {
            span_ref.extensions_mut().insert(fields);
        }
    }

    fn on_record(&self, id: &tracing::Id, values: &tracing::span::Record<'_>, ctx: Context<'_, S>) {
        if let Some(span_ref) = ctx.span(id)
            && let Some(fields) = span_ref.extensions_mut().get_mut::<Fields>()
        {
            values.record(fields);
        }
    }

    fn on_event(&self, event: &tracing::Event<'_>, ctx: Context<'_, S>) {
        let meta = event.metadata();
        let level = meta.level();

        let mut fields = Fields::new();
        event.record(&mut fields);

        // Walk the span chain from root to leaf
        let span_ctx = ctx
            .event_scope(event)
            .map(|scope| {
                scope
                    .from_root()
                    .map(|span| {
                        let name = span.metadata().name();
                        let ext = span.extensions();
                        let field_str = ext
                            .get::<Fields>()
                            .map(|f| {
                                if f.rest.is_empty() {
                                    return String::new();
                                }
                                let pairs: Vec<_> =
                                    f.rest.iter().map(|(k, v)| format!("{k}={v}")).collect();
                                format!("{{{}}}", pairs.join(", "))
                            })
                            .unwrap_or_default();
                        format!("{name}{field_str}")
                    })
                    .collect::<Vec<_>>()
                    .join(":")
            })
            .unwrap_or_default();

        let origin = meta
            .file()
            .and_then(|file| meta.line().map(|ln| format!("{file}:{ln}")))
            .unwrap_or_default();

        let event_fields = if fields.rest.is_empty() {
            String::new()
        } else {
            let pairs: Vec<_> = fields
                .rest
                .iter()
                .map(|(k, v)| format!("{k}={v}"))
                .collect();
            format!(" {}", pairs.join(", "))
        };

        let span_prefix = if span_ctx.is_empty() {
            String::new()
        } else {
            format!("{span_ctx}: ")
        };

        let line = format!(
            "{level} {origin} {span_prefix}{}{}",
            fields.message, event_fields,
        );

        match *level {
            Level::ERROR => console_error(&line),
            Level::WARN => console_warn(&line),
            Level::DEBUG | Level::TRACE => console_debug(&line),
            _ => console_info(&line),
        }
    }
}
