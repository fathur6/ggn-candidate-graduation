# Graph Report - .  (2026-07-14)

## Corpus Check
- Corpus is ~1,708 words - fits in a single context window. You may not need a graph.

## Summary
- 43 nodes · 40 edges · 12 communities (7 shown, 5 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_AppScript Manifest|AppScript Manifest]]
- [[_COMMUNITY_Admin Management|Admin Management]]
- [[_COMMUNITY_User Auth & Data Pipeline|User Auth & Data Pipeline]]
- [[_COMMUNITY_Dashboard Serving|Dashboard Serving]]
- [[_COMMUNITY_Spreadsheet Configuration|Spreadsheet Configuration]]
- [[_COMMUNITY_Admin Modal & Access Control|Admin Modal & Access Control]]
- [[_COMMUNITY_Loading Status Bar|Loading Status Bar]]
- [[_COMMUNITY_Student Modal|Student Modal]]
- [[_COMMUNITY_Toast Notifications|Toast Notifications]]
- [[_COMMUNITY_GAS Runtime|GAS Runtime]]

## God Nodes (most connected - your core abstractions)
1. `getAdminList()` - 7 edges
2. `isCurrentUserAdmin()` - 5 edges
3. `getPostgraduateData()` - 5 edges
4. `Graduation Dashboard (Modul Graduasi Siswazah)` - 4 edges
5. `webapp` - 3 edges
6. `getSpreadsheetId()` - 3 edges
7. `verifyUserAccess()` - 3 edges
8. `getAdminsWeb()` - 3 edges
9. `addAdminWeb()` - 3 edges
10. `removeAdminWeb()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `fetchDataFromSheet()` --calls--> `getPostgraduateData()`  [EXTRACTED]
  index.html → Code.gs
- `openAdminModal()` --calls--> `getAdminsWeb()`  [EXTRACTED]
  index.html → Code.gs
- `checkGoogleIdentity()` --calls--> `verifyUserAccess()`  [EXTRACTED]
  index.html → Code.gs

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin Management Flow** — code_getadminlist, code_addadminweb, code_removeadminweb, index_addadminaction, index_removeadminaction, index_adminmodal [EXTRACTED 1.00]
- **Data Loading Pipeline** — index_checkgoogleidentity, code_verifyuseraccess, index_fetchdatafromsheet, code_getpostgraduatedata, index_processdata, index_rendergraphics [EXTRACTED 1.00]

## Communities (12 total, 5 thin omitted)

### Community 0 - "AppScript Manifest"
Cohesion: 0.25
Nodes (7): dependencies, exceptionLogging, runtimeVersion, timeZone, webapp, access, executeAs

### Community 1 - "Admin Management"
Cohesion: 0.43
Nodes (5): addAdminWeb(), getAdminList(), getAdminsWeb(), isCurrentUserAdmin(), removeAdminWeb()

### Community 2 - "User Auth & Data Pipeline"
Cohesion: 0.33
Nodes (5): Session, verifyUserAccess(), checkGoogleIdentity(), fetchDataFromSheet(), processData()

### Community 3 - "Dashboard Serving"
Cohesion: 0.40
Nodes (4): Chart.js, Font Awesome, Graduation Dashboard (Modul Graduasi Siswazah), Tailwind CSS

### Community 4 - "Spreadsheet Configuration"
Cohesion: 0.40
Nodes (4): getPostgraduateData(), getSpreadsheetId(), PropertiesService, SpreadsheetApp

## Knowledge Gaps
- **16 isolated node(s):** `timeZone`, `dependencies`, `executeAs`, `access`, `exceptionLogging` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAdminList()` connect `Admin Management` to `User Auth & Data Pipeline`, `Spreadsheet Configuration`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `getPostgraduateData()` connect `Spreadsheet Configuration` to `Admin Management`, `User Auth & Data Pipeline`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `isCurrentUserAdmin()` connect `Admin Management` to `Spreadsheet Configuration`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Graduation Dashboard (Modul Graduasi Siswazah)` (e.g. with `Chart.js` and `Font Awesome`) actually correct?**
  _`Graduation Dashboard (Modul Graduasi Siswazah)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `timeZone`, `dependencies`, `executeAs` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._