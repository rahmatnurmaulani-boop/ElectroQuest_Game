# Generation record

All eight PNG sources were created during this task with the built-in `image_gen.imagegen` tool, requested with `transparent_background: true`. No API key, paid API fallback, stock artwork, previous conversation image, or pre-existing project art was used. Files were copied into this directory from the tool's reported Codex generated_images destination. No external license is asserted for generated art; provenance is recorded instead. SHA-256 for normalized inputs is recorded in normalization-audit.json.

## 1. raka-master.png — no reference

Create ONE original master character sprite for ElectroQuest educational 16-bit side-view game. Full body Indonesian male high school student Raka, short black hair, white short sleeve school shirt, gray long trousers, dark shoes, small navy backpack, cyan Charge Glove on his visible RIGHT hand. Facing right in excited confident neutral standing idle pose. Crisp deliberate pixel art, limited palette navy #111e35 blue gray #526780 white #edf5fa cyan #39ddeb amber #ffbc55 skin #bf855f. Top-left lighting, no text, no grid, no ground shadow, genuine transparent background. Full body fully contained with generous transparent margin. Design for eventual 64x96 pixel canvas, character height about 80 pixels. One character only. No extra poses.

## 2. raka-idle-source.png — reference: raka-master.png

Use attached NEW master as identity reference. Make Raka IDLE animation production source, exactly FOUR full body poses in ONE horizontal row, equal cells, generous gaps and transparent padding. Same Indonesian schoolboy identity, hair white shirt gray trousers backpack and cyan glove on SAME visible near arm as reference. Side view facing right. Four subtly DIFFERENT poses: resting breathing in, chest raised shoulders up, breathing peak slight head tilt, exhale shoulders relaxed. Feet stay on exact common baseline and same x within each cell. No glow or haze around silhouette, no shadow, no text/grid. Crisp clean 16-bit pixel art simplified for 64x96 final frames. Entire bodies visible no cropping. Genuine transparent background. This image contains only this one animation, exactly four frames.

## 3. raka-walk-source.png — reference: raka-master.png

Production WALK CYCLE for the attached original Raka master, same face hair uniform backpack and cyan glove on SAME near arm. Exactly EIGHT different full-body walking poses arranged in a 4-column 2-row equal cell grid, ordered left-right top-bottom. Side-view facing right. Frame sequence: right foot forward contact; down recoil; passing left foot; up left swing; left foot forward contact; down recoil opposite; passing right foot; up right swing. Real alternating leg bend and arms swinging, consistent scale, grounded contact baseline, empty transparent padding around each full body. Clean simplified 16bit pixel sprite suited to 64x96 final. No text, no grid lines, no haze, no ground shadows. Transparent background. All 8 entire bodies visible and separated. Do not repeat same standing pose.

## 4. raka-tool-source.png — reference: raka-master.png

Raka using his cyan Charge Glove animation source. Match attached new master identity, hair, uniform, backpack and near-side gloved hand. Exactly SIX distinct full body poses in 3 columns by 2 rows equal cells, left-right top-bottom: 1 idle stance; 2 near glove elbow bending forward; 3 glove extended toward right waist height; 4 glove extended forward palm open cyan energized hand; 5 elbow retracting halfway; 6 returning to same idle stance as frame 1 with a slight hand relaxation. Facing right. Keep same planted feet, scale, baseline within cells. Do NOT transfer glove to other arm. Crisp 16-bit pixel art simplified for 64x96 final canvas. No beams, no particles outside glove, no glow haze, no text/grid/shadow. Full bodies separated by generous transparent margins. Genuine transparent background.

## 5. ion-master.png — no reference

Create original master ION small floating science companion robot sprite. One robot only, simple compact rounded square navy and blue-gray body, white armor plates, cyan digital face with two luminous rectangular eyes and happy small mouth, two tiny side fins, one short antenna, small cyan thruster under body. Side view three-quarter facing right, readable simplified 16-bit crisp pixel art for final 48x48 canvas. Limited navy #111e35 gray #526780 white #edf5fa cyan #39ddeb amber #ffbc55. Top-left lighting. Genuine transparent background. No shadows, no surrounding glow haze, no text, no floor. Entire robot contained in generous margins.

## 6. raka-portrait-source.png — reference: raka-master.png

Create one original dialogue portrait of Raka using this newly created master as exact identity reference. Indonesian male high school student, same short spiky black hair, friendly excited smile, white uniform shirt navy backpack strap, visible cyan Charge Glove raised near chest on same near-side arm. Bust portrait, facing right three-quarter. Crisp simplified chunky 16-bit pixel art designed to remain readable at 128x128. Head and shoulders fully contained with generous transparent margin, no circles or frame or text, no glowing background haze. Top-left light, navy blue-gray white cyan amber palette plus warm brown skin. Genuine transparent background.

## 7. ion-idle-source.png — reference: ion-master.png

Use attached newly made ION master as exact reference. Create exactly FOUR full robot idle animation poses in a single horizontal row equal cells, generous transparent margins. Same face, antenna, white navy armor and side fins, cyan accents and amber antenna tip. Frames: 1 happy eyes floating neutral fins level, 2 gently lifted fins slightly up thruster short, 3 eyes blink horizontal lines fins up thruster longer, 4 happy eyes fins down thruster medium returning to neutral. Real subtle fin and face changes. Body consistent scale, tiny 1-2 pixel apparent bob when final 48x48. Crisp simplified 16bit pixel art. No text/grid, no ground shadow, no outside glow or haze, genuine transparent background. Entire robot antenna and thruster contained in each cell.

## 8. ion-portrait-source.png — reference: ion-master.png

One dialogue portrait of ION exactly matching the attached newly made original robot master. Friendly cyan digital eyes and smile, navy screen, white and gray armor, cyan side fins, short amber antenna. Three quarter view facing right. Whole robot contained with generous transparent margins, enlarged head/body readable at 128x128. Crisp 16-bit pixel art, limited navy blue-gray white cyan amber palette, top left light. No text, no frame, no ground or shadow, no surrounding glow haze. Genuine transparent background.

## Processing

Raw source is not a runtime sheet. The import script splits only the known layout of each animation, measures the nontransparent subject, normalizes scale without stretching, keeps the sources intact, saves individual frames, then assembles final sheets. The source generation grouped poses within each animation; environment/UI/puzzle were never part of a combined poster. This is a first production pass, with residual frame-to-frame drawing differences documented in ASSET_QA.md.
