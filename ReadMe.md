# wrangler
Make board level repair easy again

## Explanation
I like watching Louis Rossman fix circuit boards with absolute confidence, and heard how he started with not knowing anything about it.

It is my perception that no one really does repair like it used to be done except a slim few rather intelligible and lucky people.

I believe this is in part because of laziness, but also how daunting current tech seems to be. Too much going on on an SoC.. I don't blame anyone for that (well except maybe companies that design them).

I've seen what google used to be used for.. essentially cross referencing, fuzzy search, and massive amounts of data available at the click of a button. Now they have reduced themselves to not so much as letting me find a stackoverflow answer with the exact text of the title.

Louis Rossman has started an online repo like Wiki for board repair, but this does not remove the daunting board appearances.

What if we applied fuzzy search, 3d printer tech, and decentralized storage/research to board repair?
Theoretically, anyone could repair circuit boards easily. We just haven't equiped ourselves with the right tools.

This project hopes to start that fire, maybe even monetize it.

## How I think it should work
### Challenges :
- Boards have multiple sizes and different standards
- Components have long model numbers, often hard to read
- No schematics for many parts, old or proprietary
- No modern query tools
- Canabalization of parts often not worth effort, and diminishes returned value

### Open sourced hardware and software tools :
- Dedicated scanner for analysing random, potentially unknown boards/segments of boards
- Always-local and optionally decentralized database of boards and their parts
- Automatic part scanning, id, and logging
- Fuzzy-search and query of any part or model number
- Ability to search up boards that have similar components locally or across decentralized db

### Example process :
1. I have a pile of random circuit boards
2. I place a board onto the scanner
3. 15 minutes later the board has been:
   - catalogged (detect if already known)
   - parts identified and linked to known datasheets
   - defect detection (charred silicon, popped capacitors.. etc)
   - submit for human quality-check of part id
   - stored in local database
   - (optionally) notification to decentralized network of parts found (enables notifications of someone looking for an unkonwn part, as well as bounty hunting)

Defects would be reported to a human oversee-er, which replaces manual labor searching that isn't even tried by most would-be repair persons.

### WIP Elevator speech :

Imagine having a legit reason to keep a stockpile of garbage boards your mom wants you to get rid of..

Imagine getting paid to scan bulk electronics, even FAR into the future.

Imagine giving a real world value to crypto currency that benefits right-to-repair on the lowest barrier for entry.
