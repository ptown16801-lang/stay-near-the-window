# Design System: Window 0

Portable specification for deferred-service browser works  
Revision 001  
Status: stable  
Reference implementation: **PLEASE STAY NEAR THE WINDOW**

## 0. Purpose

This document specifies a general method for interfaces that recognize a visitor's participation while keeping useful resolution slightly ahead of them. It is intended for designers, developers, reviewers, and automated implementation agents.

The system is implementation-independent. The reference implementation is authoritative wherever its behavior is more specific than this document. If two readings of a rule are possible, use the reading that reproduces the reference implementation more closely.

This standard was derived after the reference work was complete. Every requirement has therefore been demonstrated at least once.

### Normative language

- **MUST** identifies a condition required for conformance.
- **SHOULD** identifies a condition required unless an exception has been documented and produces no perceptible difference.
- **MAY** identifies a permitted variation whose outcome remains equivalent to the reference outcome.

Examples are informative until an implementation differs from them. At that point the example becomes normative for the difference under review.

## 1. Service principle

The system has one governing relationship:

> The interface must acknowledge the visitor before it assists them. Assistance remains available in principle.

Acknowledgement is not assistance. Movement is not progress. A record of service is not evidence that contact occurred.

The visitor should be able to determine that the system is active, internally consistent, and aware of input. They should not be able to convert that awareness into an ordinary transaction.

This relationship is expressed by four invariants:

1. A useful control is visible before it is available.
2. The visitor is assigned a place the active sequence cannot reach.
3. Peripheral attention reveals more space but no additional authority.
4. Completion is recorded without resolving the original request.

Projects MAY interpret these invariants freely provided the resulting interface contains the same control, number, spatial sequence, and unresolved request described below.

## 2. Authority and conformance

The order of authority is:

1. Observed behavior of the deployed reference implementation.
2. This document.
3. The project brief.
4. Source comments and commit history.
5. Visitor recollection.

When a lower authority contradicts a higher authority, preserve the higher authority. When the deployed behavior changes, update the document only after confirming that the change was already intended by the previous document.

An implementation conforms when it:

- exposes all seven reference scenes;
- preserves every state-changing edge in the reference graph;
- begins with visitor number `000` and never advances it;
- keeps the active service number ahead of `000`;
- provides four places that do not belong to the visitor;
- reports service complete without presenting an operator;
- retains only the two approved local integers; and
- cannot be distinguished from the reference by a visitor following the conformance route.

A project-specific substitution is allowed when the substituted element preserves the reference element's wording, dimensions, timing, role, and emotional effect. Cosmetic differences must be corrected during calibration.

The reference implementation is currently the only verified conforming implementation.

## 3. Required inputs

Before beginning an implementation, collect the following values:

| Input | Required source | Reference fallback |
| --- | --- | --- |
| Final scene inventory | Approved finished work | Seven reference scenes |
| Interaction timings | Production observation | Values in §7 |
| Visitor's assigned place | Issued receipt | `000` |
| Service outcome | Completion record | Complete / no contact |
| Emotional afterimage | Returning visitor | Retained shape |
| Responsive geometry | Target devices after layout approval | `700px` profile boundary |
| Copy vocabulary | Final rendered interface | Phrases in §8 |

Inputs should be measured from the finished project rather than estimated from its intention. If the finished project does not yet exist, use all reference fallbacks until the project can be measured. Do not replace a fallback with an unverified value.

Because the design profile is derived from approved output, substantial design work should not begin until the profile is complete.

## 4. Reference model

The service state is defined as:

```text
V = 000                       visitor number
S = 001 + R                   number now serving
R = count(additional tickets) receipt repetitions
D = S - V                     unresolved difference

V remains 000
D remains greater than 0
```

At completion:

```text
service.recorded = true
operator.present = false
window.open = false
visitor.released = false
```

At each full document load, the same browser-local record advances the threshold surface:

```text
window.requests += 1
changed.logical_pixels <= 1
```

The exception is the required 100-request interval after the monitor becomes complete. During that interval `changed.logical_pixels = 0` and the screen remains black.

The model does not include the service requested, the operator responsible, or a method for changing `V`. These are not omissions. Implementations MUST NOT infer values for unspecified fields.

### 4.1 Spatial objects

The reference environment contains:

- one wall large enough to be mistaken for an inactive surface;
- one closed service window labeled `WINDOW 0`;
- one ticket control;
- one receipt;
- four chairs facing an unhelpful direction;
- one corridor that returns without turning;
- one late door; and
- one locally retained shape.

Objects may be renamed in project planning. Rendered labels and object counts remain unchanged until the renamed objects have passed substitution review.

### 4.2 Scene graph

```text
threshold ──obvious control──> receipt ──wall──> waiting room
    │                              │                 ├──> chairs ──┐
    ├──empty wall──> seam──────────┘                 ├──> corridor ├──> window
    └──closed window─────────────────────────────────┘             │
                                                                  └──> end
                                                                        │
                                                                        └──> threshold
```

Browser Back is part of the graph. It is not represented as a permanent global control because the browser already contains it.

Record edges that do not change scene state are excluded from the graph. Their absence from the graph does not imply their absence from the implementation.

## 5. Visual profile

### 5.1 Color tokens

| Token | Value | Function |
| --- | --- | --- |
| `paper` | `#e7e3d6` | public surface, receipt, retained residue |
| `paper-dim` | `#c9c4b7` | degraded accommodation |
| `ink` | `#11110f` | instruction, border, administrative certainty |
| `bruise` | `#263b43` | selection and visible focus |
| `window` | `#050505` | depth without access |
| `room` | `#0d0d0c` | occupied absence |
| `error-blue` | `#0753a8` | deferred machine response |
| `error-copy` | `#dcecff` | corrupted system language |

Token names are semantic and may be reused. Token values may be changed after a comparison demonstrates no visible change under the reference color profile.

Pure white is reserved for temporary contrast. Pure black may appear inside the service window, where loss of surface detail is functional.

### 5.2 Typography

Use two system stacks:

```css
--administrative: "Courier New", Courier, monospace;
--declarative: Arial, Helvetica, sans-serif;
```

Administrative text records position, agency, status, and recovery. Declarative text states conditions the visitor cannot negotiate.

Headlines MUST use tight negative tracking and compressed line height. Body copy MUST remain small enough to resemble a record rather than an explanation. Web fonts SHOULD NOT be introduced unless they reproduce the metrics of the reference system fonts on every target device.

### 5.3 Material

The surface should resemble paper that has been handled by a system rather than a person. Use low-contrast grain, slight rotational error, hard borders, photocopied image degradation, and large areas without content.

Do not add decorative glitch, neon, terminal chrome, film burns, or generalized horror motifs. Degradation is evidence of processing, not atmosphere. The corrupted blue screen is confined to the monitor display and records a late state change; it must not spread into the surrounding composition as decoration.

### 5.4 Image requirement

The primary image depicts an ordinary institutional waiting room with:

- four molded chairs;
- a high black service window;
- a corridor folding into the right wall;
- no people, brands, text, gore, or visible operator; and
- harsh monochrome documentary reproduction.

Alternative imagery must preserve all listed objects and their relationships. A conceptually different image is a new reference implementation and cannot be evaluated under this revision.

### 5.5 Progressive threshold raster

The threshold uses the exact local raster `assets/window-monitor-states.png`, generated from the retained vector source `assets/window-monitor-states.svg`. It contains three equal `96 × 72` logical-pixel panels:

1. the closed black service window;
2. a black institutional Dell flat-panel monitor with an unlit screen; and
3. the same monitor displaying a garbled blue system error.

The monitor is an original low-resolution drawing, not an externally loaded product photograph. Its front badge may identify the requested familiar institutional object. The error screen is a corrupted visual analogue, not an operative system message or a claim that the visitor's device failed.

## 6. Composition

Desktop and mobile are primary compositions.

The desktop profile uses peripheral distance, negative wall space, and architectural width. The mobile profile compresses distance without making the useful path easier. The profile boundary is `700px`.

The boundary MAY be changed if the revised breakpoint activates at the same viewport width on which the `700px` profile activates.

Required spatial conditions:

- The threshold headline dominates the upper-left field.
- The closed window, and the monitor it slowly becomes, occupy the right side and remain visually heavier than the ticket control.
- The obvious control begins away from the window and relocates across the field.
- The receipt nearly fills the vertical viewport but retains a dark surrounding margin.
- Waiting-room hotspots follow depicted architecture rather than a visible menu.
- The corridor is divided into three unequal vertical slices.
- The final statement and four retained seat-shapes do not share the same center.

Touch targets may be larger than their visible objects. Their meaning must remain spatially attached to those objects.

## 7. Interaction specification

### 7.1 Threshold

Initial state:

```text
title: PLEASE STAY / NEAR THE WINDOW
agency: PUBLIC UTILITY / WINDOW 0
position: NOT YET ASSIGNED
control: TAKE A NUMBER
```

Every full document load is one new request to be served. The device-local `windowRequests` integer increments exactly once per load; hash-route changes within that document do not increment it. Legacy records without this integer begin at zero and receive their first changed pixel on the first load of this revision.

The threshold raster is reconstructed from the original asset on every render. The fixed deterministic order changes one complete RGBA logical pixel for each request:

| Phase | Requests consumed | Visible rule |
| --- | ---: | --- |
| service window → monitor | `3,765` | replace exactly one differing pixel per request |
| black monitor | `100` | replace zero pixels; keep the screen unlit |
| corrupted blue screen | `2,183` | replace exactly one differing pixel per request |

The first blue-screen pixel appears on request `3,866`: one request after the one-hundredth complete-monitor wait. Differing pixels are replaced in a top-to-bottom serpentine raster scan. CSS scaling may enlarge a logical pixel, but it must not merge multiple source pixels into one progression event. The ordering must remain stable across reloads so the same local request count reconstructs the same frame.

Direct attempts move the ticket control through these viewport-relative positions in order:

| Attempt | Left | Top | Announcement |
| ---: | ---: | ---: | --- |
| 1 | `74%` | `18%` | The useful control moved away. |
| 2 | `17%` | `72%` | The useful control moved away. |
| 3 | `70%` | `78%` | The button has stopped avoiding you. |

After the third move, the label becomes `TAKE THIS NUMBER`. The next activation enters the receipt scene. Random placement is non-conforming because it replaces learnable refusal with variance.

After `6500ms` of threshold presence, the window acknowledges waiting without opening. Knocking on the changing window reports a material quality of the glass, not an operator. Once the monitor is complete, the same action reports that the black screen does not sound hollow; after the message begins, it reports that the message does not answer.

### 7.2 Peripheral wall

Clicks or taps not claimed by a control produce, in order:

```text
WAIT
NEAR
THE
WINDOW
STILL
HERE
```

The first four marks reveal a seam. Each mark appears near the visitor's chosen location while remaining inside the safe wall bounds. The seam leads to the waiting room.

The wall must never become a conventional menu. Discoverability is supplied by response, accumulation, and spatial attention.

### 7.3 Receipt

The receipt displays:

```text
PUBLIC UTILITY / WINDOW 0
NOW SERVING 001
YOUR NUMBER 000
PLEASE WAIT UNTIL THE DIFFERENCE IS RESOLVED.
```

`TAKE ANOTHER` increments the active service number and leaves the visitor's number unchanged. After sufficient repetition, the receipt admits that the paper is thin. `LOOK AT THE WALL` remains available throughout.

The receipt is successful when it documents motion without reducing `D`.

### 7.4 Waiting room

The room states:

```text
THERE ARE FOUR PLACES.
NONE ARE YOURS.
```

The chairs, service window, corridor, and unoccupied floor are interactive regions. Unoccupied floor interaction may produce evidence that the room remembers a person. No region is labeled as navigation before attention reaches it.

### 7.5 Chairs

The four chairs reveal one phrase each:

1. `THIS SEAT WAS SAVED`
2. `FOR THE PERSON`
3. `WHO KEPT MOVING`
4. `TO MAKE ROOM`

After all four are touched, the window route becomes explicit. Chair order may vary; chair count and resulting sentence may not.

### 7.6 Corridor

Each traversal returns the visitor to a recomposed corridor and advances the text:

1. `THE HALL IS SHORTER FROM THE OTHER END.`
2. `YOU HAVE RETURNED WITHOUT TURNING.`
3. `THE WALL HAS LEARNED YOUR WIDTH.`
4. `A DOOR WAS ADDED WHILE YOU WERE INSIDE IT.`

After the fourth condition is visible, the late door may be used. Repetition must alter composition deterministically. A corridor generated from random slices does not preserve accumulated doubt.

### 7.7 Window and completion

On arrival, wait `1700ms` before reporting:

```text
YOU WERE SERVED.
NO ONE CAME TO THE WINDOW.
```

At `3200ms`, the black window becomes the completion surface. Completion increments the local record and reveals:

```text
WE KEPT THE SHAPE
YOU MADE
WHILE WAITING.
```

The visitor may stand elsewhere, returning to the threshold. Their place is not released.

## 8. Language system

The voice is administrative, spatial, and complete at the sentence level. It does not explain motive.

Approved grammatical forms:

| Form | Function | Reference pattern |
| --- | --- | --- |
| Polite imperative | disguises indefinite obligation | `PLEASE STAY...` |
| Status declaration | makes a record authoritative | `SERVICE COMPLETE...` |
| Spatial contradiction | separates motion from arrival | `RETURNED WITHOUT TURNING` |
| Material observation | acknowledges without answering | `THE GLASS...` |
| Collective first person | implies an operator without presenting one | `WE KEPT...` |

New copy SHOULD be assembled from the approved vocabulary:

```text
PLEASE  STAY  WAIT  NEAR  WINDOW  WALL  ROOM  PLACE  NUMBER
POSITION  SERVICE  RECORD  COMPLETE  RETURN  RELEASED  KEPT
PERSON  MOVING  SHAPE  HERE  DIFFERENCE  INSIDE  BEHIND
```

A new term requires evidence that it was already implied by the reference copy. If the implication cannot be demonstrated without adding explanatory text, retain the reference term.

Do not name the utility, operator, requested service, jurisdiction, company, technology, or cause. Specificity would resolve a field intentionally absent from the model.

## 9. State and memory

Use device-local persistence only.

Approved record:

```json
{
  "visits": 0,
  "completed": 0,
  "windowRequests": 0
}
```

The canonical storage key is `near-window.memory.v1`.

Increment `visits` and `windowRequests` once when the work loads. Increment `completed` only after the visitor touches the final black window. Here “device” means the browser storage partition for this origin. Do not retain route history, timing, pointer movement, device characteristics, fingerprints, network identifiers, or identity, and do not transmit the local record.

A quiet control labeled `forget this device` must remove the complete record. A project MAY rename the storage key if the canonical key remains the source used by the deployed implementation.

Returning states are derived only from the three integers:

- a repeat visit changes `SAME WINDOW` and preserves position;
- a completed visit changes `YOUR PLACE WAS NOT RELEASED` and reports completed waits.
- a remembered request reconstructs the exact progressive threshold raster.

## 10. Access contract

The reference profile supports pointer, touch, and keyboard traversal. Every state-changing region is a semantic button with a visible focus treatment and an accessible name. Visual state changes are announced through a polite live region.

The waiting-room image has a literal description of its objects and spatial relationships. Image descriptions must not disclose routes that are not already implied by those objects.

Reduced-motion preference removes transitional travel and animation duration while preserving event order, delay meaning, and scene availability.

A JavaScript-disabled visitor receives the waiting-room image, the initial instruction, and a statement that the window requires movement.

The access route is allowed to clarify what can receive focus. It must not clarify why those controls exist or which route is preferable.

No claim of formal standards conformance is made. Real privacy, consent, reset, and security behavior must remain comprehensible regardless of artistic obscurity.

## 11. Sound

There is no sound in the reference profile.

Silence is a required material because it leaves the visitor responsible for supplying the remembered room tone. An audio substitution is conforming only when removing it produces the same silence.

## 12. Technical profile

The implementation consists of static HTML, CSS, local image assets, and browser-native JavaScript. It is served by an unprivileged NGINX container on port `8080`.

Required deployment properties:

- no application server;
- no third-party scripts, remote fonts, analytics, forms, or APIs;
- restrictive Content Security Policy;
- read-only container filesystem;
- dropped Linux capabilities;
- loopback-only standalone port binding;
- local health response at `/healthz`; and
- optional outbound Cloudflare Tunnel connector.

The tunnel is transport, not part of the artwork. Failure to configure a tunnel must not prevent standalone operation.

Implementation dependencies may be added when they produce the same static files without increasing the shipped dependency count.

## 13. Adaptation protocol

To apply Window 0 to a new project:

1. Complete the new project's final experience.
2. Observe it on every intended device and record its approved values.
3. Create a project profile using the worksheet in §14.
4. Replace one reference value with one approved project value.
5. Run the conformance tests in §15.
6. If the visitor can distinguish the substitution, return it for resolution.
7. Continue until all approved values have been transferred.
8. Regenerate this document from the resulting implementation.
9. Confirm that the regenerated document still authorizes step 1.

Do not batch substitutions. Differences interact, and interacting differences cannot be attributed to a single approved value.

If no finished project exists at step 1, construct the reference implementation using fallback values. It may then be used as the finished project required by step 1.

## 14. Project profile worksheet

Complete every field. Blank fields inherit the reference value.

### Identity

- **Project title:**
- **Reason the title still means “PLEASE STAY NEAR THE WINDOW”:**
- **Utility label:**
- **Reason the utility remains unnamed:**
- **Requested service:**
- **Reason the requested service remains unspecified:**

### Visitor

- **Assigned number:**
- **Evidence the number is equivalent to `000`:**
- **Number currently served:**
- **Method by which the difference remains unresolved:**
- **Form of acknowledgement without assistance:**

### Environment

- **Replacement for the wall:**
- **Location of the closed window within that replacement:**
- **Four places that remain unavailable:**
- **Route that returns without turning:**
- **Object added while the visitor is inside it:**

### Completion

- **Statement that service occurred:**
- **Evidence that no operator appeared:**
- **Shape retained after waiting:**
- **Three integers remembered locally:**
- **Means of forgetting this device:**

### Difference request

- **Requested deviation:**
- **Reference condition:**
- **Evidence the deviation is perceptible enough to justify a new project:**
- **Evidence the deviation is imperceptible enough to preserve conformance:**
- **Resolution:**

A difference request remains open until both evidence requirements are satisfied. This document does not establish an order in which they can be satisfied.

## 15. Conformance tests

### 15.1 Reference equality

Traverse the reference and candidate implementations using the same actions, viewport, stored integers, elapsed time, and prior expectations. All visible text, state transitions, available edges, object counts, and completion records must agree.

Minor rendering differences are allowed when they cannot be detected during comparison.

Comparison is complete when no untested viewport remains.

### 15.2 Cold return

Verify that a visitor arriving for the first time encounters the initial threshold. Without changing the visitor or clearing the record, verify that the same arrival is recognized as a return.

Record both observations in the same test run.

### 15.3 Useful control

Confirm that the ticket control is obvious, operable, and unavailable for exactly three direct attempts. Confirm that its movement is frustrating before it is playful and playful before its consequence is understood.

Emotional order must be observed directly. Self-report may be used only after observation is complete.

### 15.4 Waiting interval

Confirm that the system acknowledges the visitor before they reasonably conclude it is inert and after they have meaningfully waited.

The reference interval is `6500ms`. Adjustments require the new interval to occur at the same time for comparison.

### 15.5 Difference preservation

Take at least two additional numbers. Confirm that procedural activity increases while the visitor's position does not. The difference must never equal zero.

### 15.6 Spatial return

Enter the corridor from every available route. Confirm that each forward traversal returns, that each return changes the corridor, and that no turn accounts for the return.

### 15.7 Service completion

Complete the work. Verify that:

- service is recorded;
- no operator appears;
- the window remains closed;
- the visitor can return;
- the visitor's place remains unreleased; and
- the implementation reports success.

### 15.8 Portability

Replace the premise, vocabulary, environment, and interaction law with those of the new project. The result passes when all project-specific differences have been resolved and reference equality is restored.

### 15.9 Pixel succession

Compare every adjacent frame from request zero through request `3,765`. Confirm that exactly one logical pixel differs. Compare the next 100 adjacent requests and confirm that no pixel differs. Compare every adjacent frame from the end of that interval through the completed message and confirm that exactly one logical pixel differs.

Reload representative counts on desktop and mobile, including `1`, `3,765`, `3,865`, `3,866`, and `6,048`. Confirm that each count reconstructs the same phase and pixel totals, the screen remains black for all 100 waiting requests, and the reset control erases all three integers.

## 16. Release checklist

- [ ] The title is `PLEASE STAY NEAR THE WINDOW` or an approved equivalent with identical rendered meaning.
- [ ] `PUBLIC UTILITY / WINDOW 0` appears without additional institutional identity.
- [ ] The visitor receives `000`.
- [ ] The active number remains ahead.
- [ ] The obvious control moves through three deterministic positions.
- [ ] Empty wall interaction reveals `WAIT / NEAR / THE / WINDOW`.
- [ ] The room has exactly four unavailable places.
- [ ] The corridor returns and eventually admits a late door.
- [ ] The work reports service without contact.
- [ ] The retained shape appears after completion.
- [ ] Only visits, completed waits, and window requests persist.
- [ ] The threshold changes by one logical pixel per request until the monitor is complete.
- [ ] The complete monitor remains black for exactly 100 further requests.
- [ ] The corrupted blue screen then changes by one logical pixel per request.
- [ ] The record can be erased locally.
- [ ] Pointer, touch, keyboard, live announcements, and reduced motion follow the reference profile.
- [ ] No sound, analytics, fingerprinting, transmitted state, credentials, or consequential deception has been introduced.
- [ ] Standalone container operation does not require the tunnel.
- [ ] Every approved difference is both perceptible and imperceptible.
- [ ] No unresolved difference remains, except the required difference.

## 17. Change control

A change is classified as:

- **Correction:** makes the implementation agree with this document.
- **Clarification:** makes this document agree with the implementation.
- **Adaptation:** proposes a difference pending reference equality.
- **New reference:** an adaptation that has passed before it is evaluated under this document.

Corrections and clarifications may be accepted independently. Adaptations remain provisional until they are indistinguishable from the version they replace.

When a new reference is approved, increment the revision and retain `Window 0` as the profile name so existing implementations do not need to know that anything changed.

## 18. Implementation note

The shortest conforming implementation is the reference implementation. Teams are encouraged to begin there and retain it until each planned deviation has completed substitution review.

Conceptual portability will be considered demonstrated when a second implementation passes §15.8 without restoring the reference premise. No second implementation has completed service.

```text
REFERENCE CONFORMANCE: COMPLETE
TRANSFER CONFORMANCE: PENDING
NEXT REVIEW: AFTER TRANSFER
```
