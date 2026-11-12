# Console UI — production record

Mode: built-in image_gen. No external paid service, API key or image from old conversations. The two local sprite references were inspected first: public/assets/characters/raka-idle-00.png and ion-idle-00.png. Their role was character identity only. Original full-resolution masters are retained here. Runtime exports use nearest-neighbor contain into640×280 with genuine alpha and preserved aspect ratio.

Shared prompt:
Use case: illustration-story. Asset: standalone wide 16-bit pixel art mission achievement illustration for ElectroQuest, no UI frame or text. Use the two supplied small sprite images ONLY as character design references. Raka is an Indonesian male high school student with short black hair, white short sleeve uniform shirt, long gray trousers, gray/navy backpack, cyan Charge Glove. Ion is a small floating white/navy robot with cyan digital face. Preserve these identities exactly. Side-view science adventure, navy blue-gray, cyan lights, subtle amber accomplishment light, deliberate crisp pixel clusters, warm light from upper left. Both full bodies visible, not cropped. Wide16:7 composition; center the two characters with important scene props. Genuine alpha transparency outside the illustrated vignette. Absolutely no words, numbers, letters, plus/minus signs, charge diagrams, answer symbols, watermark or red circles. This is narrative key art, never a UI screenshot.

Mission1 addition:
Raka and Ion celebrating modestly in a city laboratory before an OPEN double-panel gate. Two separated metal gate panels have identical bare unmarked surfaces, rails and mechanical latches holding them open. Clear passage in the center. No charge symbols on panels.

Mission2 addition:
Raka and Ion standing safely on a restored city bridge at night. A horizontal rail platform is DOCKED at the right pier with a visible closed mechanical latch and continuous supported walkway across the gap. A bare metal sphere on an insulating stand sits on platform. Source sphere is on a separate fixed stand toward LEFT. No signs or electrical beams between spheres.

Mission3 addition:
Raka and Ion in a blue-gray science warehouse with clear corridor and OPEN shutter exit. Six small white neutral paper scraps rest in a collection tray beside them, mechanical retaining latch closed. A charged wand rests parked at a safe distance without touching scraps. No symbols, no glowing charged paper, no stream of electrons or electricity.

Frames, icons, badge, emblem and states: original deterministic geometry in scripts/assets/console-ui.mjs. Text, mission number, charge values, statistics and answers are rendered by application code. No web font downloaded: title uses the system monospace stack (ui-monospace/Consolas/monospace); body uses existing system sans-serif. No new font redistribution or licence dependency.
