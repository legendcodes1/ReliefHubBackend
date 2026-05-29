# ReliefHub

ReliefHub is a guided recovery exercise recommendation context. It exists to provide clear, non-diagnostic exercise guidance that users can organize into personal or community routines.

## Language

**ReliefHub**:
The product and canonical name of this system.
_Avoid_: Pain Relief Hub, Rehab Hub, app

**User**:
An authenticated person using ReliefHub.
_Avoid_: account, patient

**Username**:
A User's unique public handle shown on community-facing surfaces such as Community Routines.
_Avoid_: nickname, display name (when canonical handle is intended)

**Body Area**:
A region of the body selected by a User to scope recommendations.
_Avoid_: body part (domain term only)

**Discomfort Type**:
A non-diagnostic category describing what a User feels in a selected Body Area.
_Avoid_: symptom (as canonical term), diagnosis

**Exercise**:
A single guided recovery movement matched to a Body Area and Discomfort Type.
_Avoid_: treatment, therapy session

**Recommendation**:
An Exercise returned because it matches the selected Body Area and Discomfort Type.
_Avoid_: AI suggestion, diagnosis

**Routine**:
An ordered collection of Exercises created by a User for repeated practice.
_Avoid_: program (when referring to one saved collection)

**Community Routine**:
A Routine marked visible to other Users.
_Avoid_: template (unless explicitly versioned as one)

**Saved Exercise**:
An Exercise bookmarked by a User for later reuse.
_Avoid_: favorite exercise

**Favorite Routine**:
A Community Routine bookmarked by a User.
_Avoid_: saved routine (when a favorite relationship is intended)

**Exercise Reaction**:
A User's lightweight like/dislike feedback on an Exercise.
_Avoid_: rating, outcome score, clinical response

## Relationships

- A **User** selects one **Body Area** and one **Discomfort Type** to request **Recommendations**
- A **Recommendation** is always an **Exercise**
- A **Routine** contains one or more ordered **Exercises**
- A **User** owns their **Saved Exercises** and **Routines**
- A **Community Routine** can be bookmarked as a **Favorite Routine** by many **Users**
- A **User** can leave at most one **Exercise Reaction** per **Exercise**

## Example Dialogue

> **Developer:** "When a User picks neck and stiffness, are recommendations personalized by AI?"
> **Domain expert:** "Not currently. A Recommendation is deterministic and based on matching Body Area and Discomfort Type."

## Flagged Ambiguities

- "body part" and "Body Area" both appear in code and UI; resolved: use **Body Area** as canonical domain language and treat `body_part` as implementation vocabulary.
- "symptom" appears in UI copy; resolved: use **Discomfort Type** as canonical domain language.
