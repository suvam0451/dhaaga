### What are mutators?

Mutators are static function collections 
that accept transport objects (PostObject, UserObject)
and help us perform some actions on them 
(e.g. - liking, bookmarking, etc.)

A mutator function must always return an equivalent object, intended for 
replacement.

A mutator function must be pure and never mutate the original object.

A mutator function must not throw an error.