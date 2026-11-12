# ElectroQuest — Gerbang Muatan

Original task-specific 16-bit side-view science adventure. No old artwork, stock, audio, fonts, or game engine imported. Canvas world 640 × 360; tiles 32 × 32. Lighting from upper left; hard pixel clusters and nearest-neighbor scaling only.

## Palette

| Role | Hex |
|---|---|
| Outline / sky | #111e35 |
| Dark structure | #253952 |
| Blue gray | #526780 |
| Light gray | #9aafc3 |
| White uniform / armor | #edf5fa |
| Technology / negative | #39ddeb |
| Attention / positive | #ffbc55 |
| Skin base / light / shade | #bf855f / #e8ac7d / #87563e |
| Plant | #6bba9a |

## Characters and anchors

Raka: Indonesian male high school student, short black hair, white shirt, long gray trousers, dark shoes, small navy backpack, cyan Charge Glove on the visible near arm. The master establishes the gloved arm; never mirror individual limbs. Right-facing three-quarter side view. Warm, enthusiastic expression. Approximately 80 px occupied height in each 64 × 96 canvas; stylized head roughly one fifth of full height. Foot anchor (32,90), normalized (0.5,0.9375). Last occupied foot row 89. Idle/tool align by sole midpoint so extending the arm does not shift the torso. Walk frames use consistent full-body scale and a fixed ground baseline.

Ion: compact floating robot, white armor, navy digital face, cyan eyes/thruster and amber antenna. 48 × 48 frame, occupied height up to 36 px; anchor (24,24). Four idle poses change eyes, fins and thruster. Portraits 128 × 128, anchor center.

## Environment, puzzle, and UI

Sky and city are independent 640 × 360 parallax layers. Facade is transparent outside architecture and has an empty gate opening at (256,112), 128 × 216. No rail, movable panel, terminal, or latch is baked into it. Generic props: lamp, crate, plant and blank sign. Object anchors default bottom center; source dimensions and special gate opening are in the manifest.

Puzzle panels are 64 × 128 with no permanent charge marks. Rail, frame, latches, terminal and destination door are separate PNGs. Preview demonstrates positioning through code; it is not puzzle logic. Draw +/−, numerical charge, and force arrows at runtime. Positive is amber with +; negative is cyan with −. Electron transfer uses a cyan minus-bearing particle along a path; decorative sparks use an amber cross burst.

Nine-slice panel is 24 × 24 with 6 px borders. Buttons are 48 × 24 with 6 px borders in normal/focus/pressed/disabled states. Icons are 24 × 24. No text is baked into UI images. Preview uses real HTML labels and CSS border-image to demonstrate resizing.

## Export

Generated sources remain untouched in assets-source/generated. Import uses a shared uniform scale per animation, nearest-neighbor sampling, alpha cutoff 128 and nearest palette quantization. This converts soft source edges to binary alpha and removes low-alpha surrounding haze without color-key deletion. Source bounding boxes, scales, hashes and palette are recorded in normalization-audit.json. Review tiny features after quantization; do not assume high-resolution source detail survives 1× export.
