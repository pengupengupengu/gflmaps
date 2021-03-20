# GFLMaps: Girls' Frontline Map Viewer
This is a map viewer for Girls' Frontline that can handle [ppost-Dual Randomness maps (with vision zones, layers, and portals), Combat Simulation, and various generations of Theater events. This is based on [GFWiki's Map Viewer](http://www.gfwiki.org/w/%E6%88%98%E5%BD%B9%E5%9C%B0%E5%9B%BE%E4%BF%A1%E6%81%AF), not CCX_CX_D's underseaworld or pohcy's hometehomete.

Examples:

* [Dual Randomness - Ranking Map 1](https://pengupengupengu.github.io/gflmaps/index.html#campaign=3041&mission=10520)
* [Dual Randomness - Ranking Map 3](https://pengupengupengu.github.io/gflmaps/index.html#campaign=3041&mission=10522)
* [Mirror Stage - Ranking Map 1](https://pengupengupengu.github.io/gflmaps/index.html#campaign=3044&mission=10674)
* [Mirror Stage - Ranking Map 2](https://pengupengupengu.github.io/gflmaps/index.html#campaign=3044&mission=10675)

## How do I report bugs?
Use the issues tracker in this repo. I aim to check it every day and acknowledge critical bugs when I see them.

Known bugs:
* Mobile experience can be improved.
* Also looks different on Firefox (sizing etc.).
* Sometimes UI elements don't disappear when they're supposed to. For example, the Layer select doesn't disappear when you select Combat Simulation.
* The Campaign/Mission selects can be laggy sometimes.

## If I fork this repo, how do I update/maintain this for new data?
The text files in `text/` are just dumped from `asset_textes.ab` (or `asset_texttable.ab` for CN text starting from 2021/02). See [Perfare/AssetStudio](https://github.com/Perfare/AssetStudio).

The data files in `data/` are decoded from files in `stc/*.stc`, using schema from `global-metadata.dat`. See [36base/GFDecompress](https://github.com/36base/GFDecompress) and [djkaty/Il2CppInspector](https://github.com/djkaty/Il2CppInspector). (However, starting from client version 2.07, `global-metadata.dat` has some new form of encryption that Il2CppInspector cannot decrypt as of 2021/01/28)

If there are new major events or collabs, you may also want to update `convertGameCampaignToUiCampaign` in `main.js` and `campaigns` in `text/*/ui_text.json`. Otherwise, maps from those events and collabs will be classified under `UNKNOWN EVENT/COLLAB`.

## TODO
Likely will do:
* Try to improve mobile browser support. Note that I don't have any Apple device so I won't be able to test on any Safari or iOS browser.
* Investigate enemy AI.

Maybe will do:
* Show chibis?
* Tweak the state management of the UI, like "Hide Map".
* Rework entire UI to look like Google Maps, or like [this](https://coronavirus.jhu.edu/map.html).

Likely will not do:
* Weird map gimmicks.
