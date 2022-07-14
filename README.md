# Route Structure
- `search.jsx` encapsulates all code relating to search initialisation
- `$paperId.jsx` encapsulates all code relating to paper traversal
- `create-reading-list.jsx` is a resource route that's called to generate and download a reading list from a traversal tree

# Component Structure
- `PaperViewer` contains all components related to viewing individual papers, including abstracts, metadata and the control panel
- `PathTraversal` contains all components related to visualising traversal through the semantic space
- `ReadingList` contains all components related to visualising the list of pinned papers
- `SeedSearch` contains all components related to initial search

# Current Failure States, Issues & Bugs
- The application will throw an error if all of the ten nearest neighbous of the active paper are already in the path from the root node to the node associated with that paper
- Generating citations takes way too long because of how slow the DOI API is

# Parts To Be Built
- 
