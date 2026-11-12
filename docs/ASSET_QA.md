# Asset QA — 12 November 2026

## Available

72 runtime PNG files; no missing or placeholder manifest entries. 42 procedural PNGs and 30 generated-derived PNGs (includes individual frames and assembled sheets, plus individual/aggregate portrait exports). Eight new untouched generated sources are retained, including Raka and Ion masters.

| Animation | Frames | Frame size | Sheet | FPS | Loop |
|---|---:|---|---|---:|---|
| Raka idle | 4 | 64 × 96 | 256 × 96 | 6 | yes |
| Raka walk | 8 | 64 × 96 | 512 × 96 | 12 | yes |
| Raka tool | 6 | 64 × 96 | 384 × 96 | 10 | no |
| Ion idle | 4 | 48 × 48 | 192 × 48 | 6 | yes |
| Spark | 5 | 24 × 24 | 120 × 24 | 16 | no |

Raka and Ion portraits are each 128 × 128. Environment includes separate sky/city/facade, six floor/wall tile variants and four separate props. Puzzle includes two charge-free panels, frame, rail, both latch states, terminal and door. UI includes nine-slice panel, four button states and all nine requested icons. Electron and decorative spark remain distinct.

## Automated verification actually run

- `node scripts/assets/import.mjs`: six generated animation/portrait inputs processed; masters retained separately.
- `node scripts/assets/build.mjs`: manifest and procedural PNGs rebuilt.
- `node scripts/assets/validate.mjs`: all 72 files decode, paths and dimensions match, frame dimensions and counts agree, keys are unique. Every character frame has transparent pixels and clear canvas margins; no frame touches canvas edges. All animation frames are pixel-distinct. Every Raka foot baseline occupies row 89, anchor y=90.
- Detailed alpha counts and per-frame occupied bounds: asset-validation.json. Original generated inputs have real zero-alpha pixels; final character alpha is binary 0/255 after explicit thresholding. Checkerboards are CSS preview backgrounds, not image content.
- `node scripts/assets/browser-check.mjs`: Chromium headless checks passed. All four character animations step through their exact frame counts and wrap. Tool animation stops at its final frame; restart works. Scale dimensions 1×/2×/4×, backgrounds and guides are operable. All 72 gallery PNGs loaded. No page errors or failed responses; no page horizontal overflow at 390 px width. Browser report: browser-validation.json.

## Visual review actually performed

Inspected newly generated sources, exported Raka walk/tool and Ion idle sheets, character screenshot on white at 4×, and complete 640 × 360 arena screenshot. Sources have separate full subjects with no obvious body cuts. Final Raka silhouette and near-side cyan glove remain visible at runtime size. Pixel edges on white have no baked checkerboard or surrounding glow. Tool feet stay planted after sole midpoint alignment; extending the hand no longer pulls the body sideways. Idle breathing, walk leg bends, tool extension and Ion blink/fin changes are present.

The preview loops idle/walk/Ion and steps last-to-first. Exported last/first poses were reviewed in sequence on the sheets. This is not a claim of hand-tuned animation quality or a real-device gameplay test. The automated test checks wrap and uniqueness, not biomechanical correctness.

## Remaining visual limitations

- Walk retains small torso/face redrawing and silhouette variation from generated poses. Ground alignment is fixed, but foot sliding and cadence should be tuned during actual movement integration. No polished pixel animator continuity certification is claimed.
- Idle has subtle hair/shoulder pixel changes; tool pose changes and cross-animation switches can show small proportion differences. No pose is duplicated to inflate the count.
- Fine eye, uniform and glove details simplify at 1×. Portraits carry the dialogue expression more clearly.
- Architecture and props are intentionally simple geometric pixel art. They share the palette but are less illustrative than the generated characters. The gate opening is genuinely empty; scene layering determines what is visible behind it.
- Procedural arrows/scanner/highlight/celebration in preview demonstrate the effect vocabulary. They are not a finished physics model or game event system. The spark animation is exported for integration; the preview gallery shows the complete sheet.
- No physical mobile/TV testing, game collision testing, audio, fonts, push or deployment was performed.

Ready for Misi 1 asset integration and first playable implementation, with walk cadence and cross-animation continuity retained as polish tasks.
