# Asset notes

Rhodo is the founder-selected company name, inspired by rhodonite, Massachusetts’ state gemstone. The angular R logo was supplied by the founder and faithfully traced as SVG. The existing vector wordmark uses Geist.

## Brand system

Every brand graphic is derived from the two polygons of the angular R. `public/brand.css` applies the mark's top-right 45° cut as the corner on buttons, video frames, photographs and number tags, and uses the mark as tone and line art behind sections. Colours are ink `#0b0d11` and mint `#65fc9f`. The files in `public/assets/brand/` are generated from the same polygon coordinates: solid, outline and tonal marks, the small "shard" bullet, the footer lockup, the share image (`og-image.png`, 1200 × 630) and the home-screen icon.

The structural-detail and studio-worktable photographs are generated illustrative brand imagery. They do not depict customer projects. Earlier botanical reference media is not included in this repository.

## Trailer and product tour

The dashboard images, trailer and narrated tour use the supplied application frontend with synthetic sample records. They are interface examples, not customer results or a demonstration of backend generation speed. Original private application source and databases are not included. A capture artifact along the top edge is repaired in the source frames before rendering.

Both videos are rendered at 2560 × 1440, 60fps, from the native 4K dashboard captures; the tour and the AI clips are published at that size, the trailer at 1920 × 1080 for a quicker start. Each video also has a 1280 × 720, 30fps version (`*-720.mp4`) that phones and windows 800px wide or narrower load instead. Every shot change, spotlight, zoom and chapter label is pinned to a phrase in the script and timed from word timestamps transcribed locally, with no upload.

In the tour, the dashboard sits in a framed window on an ink stage; a virtual camera eases toward each feature and a mint spotlight dims everything around it. The camera carries across cuts, so views of the same page never jump or double up.

The trailer (0:38) follows one pursuit from a federal deadline to an assembled SF330. Screens are shown as floating cards cut from the same captures, never redrawn: UI elements that appear during a shot (pipeline cards, the fit score, checks, matrix dots, GENERATED chips) are revealed from the capture's own pixels, and the fit score counts up in the dashboard's own font. The music bed is an Eleven Music instrumental, edited on its bars to the narration (a stop before “Rhodo”, a second drop on “Your whole SF330”, a final hit on the last “Rhodo”) and ducked under the voice; the light sound effects are synthesized.

The narration is ElevenLabs Roger on Eleven v3, one continuous take each: the tour (2:18) at Natural stability (0.5), and the trailer (0:38 with its end card) at Creative stability, directed with audio tags for a livelier read that closes on “Rhodo! From SAM.gov… to a winning proposal!”. Each is loudness-normalised to −16 LUFS, with a short lead-in (0.35 s for the trailer, 0.5 s for the tour); the trailer's final mix with music and effects is also −16 LUFS. The company name stays Rhodo in all visible text and captions; its pronunciation is ROH-doh, written “Roh-doh” in the synthesis script.

The three AI examples are narrated excerpts of the same tour, cut at chapter boundaries, at normal speed, with English captions. Playback starts only after a visitor chooses an example or presses play; changing examples or opening the full product tour pauses the previous audio. Posters are frames from the tour.

Geist and Inter are distributed with their SIL Open Font Licenses in `public/assets/fonts/`. The site loads Latin subsets of both as WOFF2 (variable weights kept), with the full TTF files as a fallback.
