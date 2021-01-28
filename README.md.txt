# GFLMaps: Girls' Frontline Map Viewer
This is a map viewer for Girls' Frontline that can handle post-Dual Randomness maps (with vision zones, layers, and portals), Combat Simulation, and various generations of Theater events. This is based on [GFWiki's Map Viewer](http://www.gfwiki.org/w/%E6%88%98%E5%BD%B9%E5%9C%B0%E5%9B%BE%E4%BF%A1%E6%81%AF), not CCX_CX_D's underseaworld or pohcy's hometehomete.

## How do I report bugs?
Use the issues tracker in this repo. I aim to check it every day and acknowledge critical bugs when I see them.

Known bugs:
* Mobile experience can be improved.
* Also looks different on Firefox (sizing etc.).
* Sometimes UI elements don't disappear when they're supposed to. For example, the Layer select doesn't disappear when you select Combat Simulation.
* The Campaign/Mission selects can be laggy sometimes.

## If I fork this repo, how do I update/maintain this for new data?
The text files in `text/` are just dumped from `asset_textes.ab`. See [Perfare/AssetStudio](https://github.com/Perfare/AssetStudio).

The data files in `data/` are decoded from files in `stc/*.stc`, using schema from `global-metadata.dat`. See [36base/GFDecompress](https://github.com/36base/GFDecompress) and [djkaty/Il2CppInspector](https://github.com/djkaty/Il2CppInspector). (However, starting from client version 2.07, `global-metadata.dat` has some new form of encryption that Il2CppInspector cannot decrypt as of 2021/01/28)

If there are new major events or collabs, you may also want to update `convertGameCampaignToUiCampaign` in `main.js` and `campaigns` in `text/*/ui_text.json`. Otherwise, maps from those events and collabs will be classified under `UNKNOWN EVENT/COLLAB`.

## TODO
Critical:
* Hook up my datamining scripts so it automatically pushes new map/enemy data.
* Take out unnecessary white space in the JSON files, and maybe also filter out fields that the map viewer doesn't actually use.

Likely will do:
* Show map Day/Night setting, Turn Limit and GnK/Coalition Squad Limits.
* Try to improve mobile browser support. Note that I don't have any Apple device so I don't won't be able to test on any Safari or iOS browser.

Maybe:
* Show rare drops from enemies?

