# @dnpm-dip/core

## [1.13.1](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.13.0...v1.13.1) (2024-06-24)


### Bug Fixes

* adjusted dtos to breaking backend changes ([29fb1c1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/29fb1c1fde9d2e5edb8cd4179ba6313d11fc6172))

## [1.13.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.12.1...v1.13.0) (2024-06-17)


### Features

* allow specifying support-variant option for mtb query ([c8bf125](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c8bf1253e9aecd3e0e15a72c86ca25fc94d634a4))
* implemeneted infinite-scroll for form-slect-search fields ([#530](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/530)) ([36dec87](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36dec87edee8482a14ff395743dbe08b1c5ccb98))


### Bug Fixes

* **deps:** bump bootstrap-vue-next from 0.21.0 to 0.21.2 ([#519](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/519)) ([d0fffb2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d0fffb2e4980654751f1d6866312f211860ed381))
* rendering grouped query-summary on patient-filter change ([52dad18](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/52dad187d538e090412b242ea7930f10609dfde2))

## [1.12.1](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.12.0...v1.12.1) (2024-06-07)


### Bug Fixes

* hot fix for admin section ([dfafc8a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dfafc8ab4130001e260d718093dbd9272fadfc99))

## [1.12.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.11.0...v1.12.0) (2024-06-07)


### Features

* add admin area with user- & role-management ([49ba49c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/49ba49c1e18c95121e49ee8ea68dd099a6fe13be))
* add expandable-content component & add patient record therapies tab ([05b4056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/05b4056f75aa21ea80dd33fd4accec8b8392a08c))
* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted mtb search form (labels, checkboxes, ...) ([8bf3d6f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8bf3d6f55cb77cd355f1646e53495643296361ec))
* adjusted summary view according to api changes + minor style enhancements ([e1cf350](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e1cf35086c84a63fbb44168ac4014cf9464adc60))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* dedicated admin module/package ([#499](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/499)) ([ff07176](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff0717649e9cdb18099256be79a37cc8765b866d))
* generate colors in close range for charts ([#477](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/477)) ([1735768](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/17357688f8c0b04e3773cab177256ae8c8f8b892))
* implemented filters for valueset/codesystem entities ([36c771d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36c771d8953e5de41e8fc0038d6c575f8e20cb44))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented patient-record view ([ac72d56](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ac72d560bfa23206e816266879210281a62dd6f4))
* implemented validation for protein change inputs ([#471](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/471)) ([0c38990](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/0c38990f9a6c40ed5ca89ec3925b75cf0cfc4a2f))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial implementaion of query info page ([#507](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/507)) ([1a5a797](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1a5a7972c2864ee240c4bad9bba50040cb939ec5))
* initial implementation of admin connection report & loading animation ([#491](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/491)) ([c950c99](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c950c996c3be0f03590fd6b58e67eb84ef525ac4))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* initial permission implementation for rd & mtb use case ([9c58cf1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9c58cf1c401e68fad4db52480cc25185e7046d4a))
* initial refactoring of module registration ([70467ff](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/70467ffe45acf1423d1085122e94a0337df3ee58))
* integrated authup in portal (store,components,pages,...) ([42937a8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/42937a8a41685f0e83b88d578db013fc5ed527e0))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* minor adjustments to patient-record view ([91bde67](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/91bde67e52b6bf7984f74090b4d00bc41dcd0f3a))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* new kit package for registering modules + initial mtb module package ([71a8384](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/71a83848a3aeb5f633fea9172f5b423d3f58df20))
* only display use-case modules on home screen ([2c468f3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2c468f3f159bdd08197a56ef7a90c8600b6858c0))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* replaced vue-layout with vuecs ([4e1c90d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4e1c90d3dea4d7ddbff9f46221f10a4defac7bbb))
* round percent values in charts to 1 fraction ([b9233b8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b9233b8145cacc275848edaae1e4e9141bae03ee))
* search select for visualisations ([51ced11](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/51ced119770b1de162c40bc1b15f5d11f300c5c2))
* support multiple catalogs for rd disease category ([60c558e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/60c558ee8f70eaea9779535ab49cec1a51c8b3b1))
* verbose coding display label via option + minor spelling fixes ([#463](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/463)) ([81cbd59](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/81cbd59110488b2c00ff337137869ce8737b017a))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* better naming for css classes ([c240266](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c2402662e2becc9c6bee60d63b8d8a8d771906db))
* build error due bar chat typings ([e53c51c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e53c51c5923045785d6f8fbe1631bf19bb226e00))
* **deps:** bump @nuxt/schema from 3.11.1 to 3.11.2 ([#367](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/367)) ([605c375](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/605c37531fbbd94b7fe204b742afd1c10a6d9a1d))
* **deps:** bump bootstrap-vue-next from 0.20.0 to 0.21.0 ([#504](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/504)) ([8b40b91](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8b40b91907ffbda606570e8008ecc4b5343e939c))
* **deps:** bump hapic from 2.3.0 to 2.4.0 ([#141](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/141)) ([87ff43b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87ff43bd9501e638e91deede6dab8af68f2a84fb))
* **deps:** bump hapic from 2.4.0 to 2.5.0 ([#214](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/214)) ([01f5056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/01f5056f95bd525bfbe8c515fee4161ea53fb644))
* **deps:** bump hapic from 2.5.0 to 2.5.1 ([#357](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/357)) ([3d08a73](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3d08a73d77efe86d6e59569a56c1ddded798baa0))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* **deps:** bump smob from 1.4.1 to 1.5.0 ([#351](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/351)) ([bc02ba2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/bc02ba296dbc1b77e479613017af7a62362995db))
* **deps:** bump ufo from 1.3.2 to 1.4.0 ([#259](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/259)) ([b7a7c9b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b7a7c9b0ca974f23952a014afff6c1b2dd58796a))
* dispaly median survival time on kp charts ([16f6f93](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/16f6f93ff2f0d21c455184ea48dc9867bf262acd))
* dropdown selection in summary grouped component ([cf9082a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/cf9082aee60bbb64444d49acdc7950376f3581a8))
* from select listener ([604ce41](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/604ce411a471f4a5c8d1c3468988750f3ba73700))
* minor adjustment for summary view ([572a5cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/572a5cbee163f398594497ae06e93b62e6572e25))
* minor enhancement to displaying snv, cnv, rna- & dn-afusion in patient list ([8963c68](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8963c68e703be9b96cf48551ac9661558c5aa578))
* mtb (sub-) forms & form-select-search component ([ae1a986](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ae1a986ed7990646e7eeaf95b21e470db1c4dde8))
* patient view rendering + better color scheme generation ([3c09a91](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3c09a91c93706d506c773e33578e6885b17bb6b2))
* rendering api client issues & toast composable for errors and custom data ([ce66cb5](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ce66cb52e5e94d6e44ea43f2c62d8bd560acaea3))
* selection of first element in summary-grouped component ([#279](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/279)) ([5e9b122](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/5e9b122e0c4f1dc18309538717c0fc2e1a9d3229))
* some spelling issues ([e80f430](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80f430e65e0f18bc62b1dfd72a52429f6d12db9))

## [1.11.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.10.0...v1.11.0) (2024-05-21)


### Features

* generate colors in close range for charts ([#477](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/477)) ([1735768](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/17357688f8c0b04e3773cab177256ae8c8f8b892))

## [1.10.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.9.0...v1.10.0) (2024-05-21)


### Features

* add admin area with user- & role-management ([49ba49c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/49ba49c1e18c95121e49ee8ea68dd099a6fe13be))
* add expandable-content component & add patient record therapies tab ([05b4056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/05b4056f75aa21ea80dd33fd4accec8b8392a08c))
* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted mtb search form (labels, checkboxes, ...) ([8bf3d6f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8bf3d6f55cb77cd355f1646e53495643296361ec))
* adjusted summary view according to api changes + minor style enhancements ([e1cf350](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e1cf35086c84a63fbb44168ac4014cf9464adc60))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* implemented filters for valueset/codesystem entities ([36c771d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36c771d8953e5de41e8fc0038d6c575f8e20cb44))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented patient-record view ([ac72d56](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ac72d560bfa23206e816266879210281a62dd6f4))
* implemented validation for protein change inputs ([#471](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/471)) ([0c38990](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/0c38990f9a6c40ed5ca89ec3925b75cf0cfc4a2f))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* integrated authup in portal (store,components,pages,...) ([42937a8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/42937a8a41685f0e83b88d578db013fc5ed527e0))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* minor adjustments to patient-record view ([91bde67](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/91bde67e52b6bf7984f74090b4d00bc41dcd0f3a))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* new kit package for registering modules + initial mtb module package ([71a8384](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/71a83848a3aeb5f633fea9172f5b423d3f58df20))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* replaced vue-layout with vuecs ([4e1c90d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4e1c90d3dea4d7ddbff9f46221f10a4defac7bbb))
* round percent values in charts to 1 fraction ([b9233b8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b9233b8145cacc275848edaae1e4e9141bae03ee))
* search select for visualisations ([51ced11](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/51ced119770b1de162c40bc1b15f5d11f300c5c2))
* support multiple catalogs for rd disease category ([60c558e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/60c558ee8f70eaea9779535ab49cec1a51c8b3b1))
* verbose coding display label via option + minor spelling fixes ([#463](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/463)) ([81cbd59](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/81cbd59110488b2c00ff337137869ce8737b017a))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* better naming for css classes ([c240266](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c2402662e2becc9c6bee60d63b8d8a8d771906db))
* build error due bar chat typings ([e53c51c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e53c51c5923045785d6f8fbe1631bf19bb226e00))
* **deps:** bump @nuxt/schema from 3.11.1 to 3.11.2 ([#367](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/367)) ([605c375](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/605c37531fbbd94b7fe204b742afd1c10a6d9a1d))
* **deps:** bump hapic from 2.3.0 to 2.4.0 ([#141](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/141)) ([87ff43b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87ff43bd9501e638e91deede6dab8af68f2a84fb))
* **deps:** bump hapic from 2.4.0 to 2.5.0 ([#214](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/214)) ([01f5056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/01f5056f95bd525bfbe8c515fee4161ea53fb644))
* **deps:** bump hapic from 2.5.0 to 2.5.1 ([#357](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/357)) ([3d08a73](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3d08a73d77efe86d6e59569a56c1ddded798baa0))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* **deps:** bump smob from 1.4.1 to 1.5.0 ([#351](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/351)) ([bc02ba2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/bc02ba296dbc1b77e479613017af7a62362995db))
* **deps:** bump ufo from 1.3.2 to 1.4.0 ([#259](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/259)) ([b7a7c9b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b7a7c9b0ca974f23952a014afff6c1b2dd58796a))
* dispaly median survival time on kp charts ([16f6f93](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/16f6f93ff2f0d21c455184ea48dc9867bf262acd))
* dropdown selection in summary grouped component ([cf9082a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/cf9082aee60bbb64444d49acdc7950376f3581a8))
* from select listener ([604ce41](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/604ce411a471f4a5c8d1c3468988750f3ba73700))
* minor adjustment for summary view ([572a5cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/572a5cbee163f398594497ae06e93b62e6572e25))
* mtb (sub-) forms & form-select-search component ([ae1a986](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ae1a986ed7990646e7eeaf95b21e470db1c4dde8))
* rendering api client issues & toast composable for errors and custom data ([ce66cb5](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ce66cb52e5e94d6e44ea43f2c62d8bd560acaea3))
* selection of first element in summary-grouped component ([#279](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/279)) ([5e9b122](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/5e9b122e0c4f1dc18309538717c0fc2e1a9d3229))
* some spelling issues ([e80f430](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80f430e65e0f18bc62b1dfd72a52429f6d12db9))

## [1.9.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.8.0...core-v1.9.0) (2024-05-17)


### Features

* add admin area with user- & role-management ([49ba49c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/49ba49c1e18c95121e49ee8ea68dd099a6fe13be))
* add expandable-content component & add patient record therapies tab ([05b4056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/05b4056f75aa21ea80dd33fd4accec8b8392a08c))
* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted mtb search form (labels, checkboxes, ...) ([8bf3d6f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8bf3d6f55cb77cd355f1646e53495643296361ec))
* adjusted summary view according to api changes + minor style enhancements ([e1cf350](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e1cf35086c84a63fbb44168ac4014cf9464adc60))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* implemented filters for valueset/codesystem entities ([36c771d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36c771d8953e5de41e8fc0038d6c575f8e20cb44))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented patient-record view ([ac72d56](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ac72d560bfa23206e816266879210281a62dd6f4))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* integrated authup in portal (store,components,pages,...) ([42937a8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/42937a8a41685f0e83b88d578db013fc5ed527e0))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* minor adjustments to patient-record view ([91bde67](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/91bde67e52b6bf7984f74090b4d00bc41dcd0f3a))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* new kit package for registering modules + initial mtb module package ([71a8384](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/71a83848a3aeb5f633fea9172f5b423d3f58df20))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* replaced vue-layout with vuecs ([4e1c90d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4e1c90d3dea4d7ddbff9f46221f10a4defac7bbb))
* round percent values in charts to 1 fraction ([b9233b8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b9233b8145cacc275848edaae1e4e9141bae03ee))
* search select for visualisations ([51ced11](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/51ced119770b1de162c40bc1b15f5d11f300c5c2))
* verbose coding display label via option + minor spelling fixes ([#463](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/463)) ([81cbd59](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/81cbd59110488b2c00ff337137869ce8737b017a))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* better naming for css classes ([c240266](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c2402662e2becc9c6bee60d63b8d8a8d771906db))
* build error due bar chat typings ([e53c51c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e53c51c5923045785d6f8fbe1631bf19bb226e00))
* **deps:** bump @nuxt/schema from 3.11.1 to 3.11.2 ([#367](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/367)) ([605c375](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/605c37531fbbd94b7fe204b742afd1c10a6d9a1d))
* **deps:** bump hapic from 2.3.0 to 2.4.0 ([#141](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/141)) ([87ff43b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87ff43bd9501e638e91deede6dab8af68f2a84fb))
* **deps:** bump hapic from 2.4.0 to 2.5.0 ([#214](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/214)) ([01f5056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/01f5056f95bd525bfbe8c515fee4161ea53fb644))
* **deps:** bump hapic from 2.5.0 to 2.5.1 ([#357](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/357)) ([3d08a73](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3d08a73d77efe86d6e59569a56c1ddded798baa0))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* **deps:** bump smob from 1.4.1 to 1.5.0 ([#351](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/351)) ([bc02ba2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/bc02ba296dbc1b77e479613017af7a62362995db))
* **deps:** bump ufo from 1.3.2 to 1.4.0 ([#259](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/259)) ([b7a7c9b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b7a7c9b0ca974f23952a014afff6c1b2dd58796a))
* dispaly median survival time on kp charts ([16f6f93](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/16f6f93ff2f0d21c455184ea48dc9867bf262acd))
* dropdown selection in summary grouped component ([cf9082a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/cf9082aee60bbb64444d49acdc7950376f3581a8))
* from select listener ([604ce41](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/604ce411a471f4a5c8d1c3468988750f3ba73700))
* minor adjustment for summary view ([572a5cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/572a5cbee163f398594497ae06e93b62e6572e25))
* mtb (sub-) forms & form-select-search component ([ae1a986](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ae1a986ed7990646e7eeaf95b21e470db1c4dde8))
* rendering api client issues & toast composable for errors and custom data ([ce66cb5](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ce66cb52e5e94d6e44ea43f2c62d8bd560acaea3))
* selection of first element in summary-grouped component ([#279](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/279)) ([5e9b122](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/5e9b122e0c4f1dc18309538717c0fc2e1a9d3229))
* some spelling issues ([e80f430](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80f430e65e0f18bc62b1dfd72a52429f6d12db9))

## [1.8.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.7.0...v1.8.0) (2024-05-09)


### Features

* add admin area with user- & role-management ([49ba49c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/49ba49c1e18c95121e49ee8ea68dd099a6fe13be))
* add expandable-content component & add patient record therapies tab ([05b4056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/05b4056f75aa21ea80dd33fd4accec8b8392a08c))
* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted mtb search form (labels, checkboxes, ...) ([8bf3d6f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8bf3d6f55cb77cd355f1646e53495643296361ec))
* adjusted summary view according to api changes + minor style enhancements ([e1cf350](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e1cf35086c84a63fbb44168ac4014cf9464adc60))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* implemented filters for valueset/codesystem entities ([36c771d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36c771d8953e5de41e8fc0038d6c575f8e20cb44))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented patient-record view ([ac72d56](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ac72d560bfa23206e816266879210281a62dd6f4))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* integrated authup in portal (store,components,pages,...) ([42937a8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/42937a8a41685f0e83b88d578db013fc5ed527e0))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* minor adjustments to patient-record view ([91bde67](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/91bde67e52b6bf7984f74090b4d00bc41dcd0f3a))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* new kit package for registering modules + initial mtb module package ([71a8384](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/71a83848a3aeb5f633fea9172f5b423d3f58df20))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* replaced vue-layout with vuecs ([4e1c90d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4e1c90d3dea4d7ddbff9f46221f10a4defac7bbb))
* round percent values in charts to 1 fraction ([b9233b8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b9233b8145cacc275848edaae1e4e9141bae03ee))
* search select for visualisations ([51ced11](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/51ced119770b1de162c40bc1b15f5d11f300c5c2))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* better naming for css classes ([c240266](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c2402662e2becc9c6bee60d63b8d8a8d771906db))
* build error due bar chat typings ([e53c51c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e53c51c5923045785d6f8fbe1631bf19bb226e00))
* **deps:** bump @nuxt/schema from 3.11.1 to 3.11.2 ([#367](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/367)) ([605c375](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/605c37531fbbd94b7fe204b742afd1c10a6d9a1d))
* **deps:** bump hapic from 2.3.0 to 2.4.0 ([#141](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/141)) ([87ff43b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87ff43bd9501e638e91deede6dab8af68f2a84fb))
* **deps:** bump hapic from 2.4.0 to 2.5.0 ([#214](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/214)) ([01f5056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/01f5056f95bd525bfbe8c515fee4161ea53fb644))
* **deps:** bump hapic from 2.5.0 to 2.5.1 ([#357](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/357)) ([3d08a73](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3d08a73d77efe86d6e59569a56c1ddded798baa0))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* **deps:** bump smob from 1.4.1 to 1.5.0 ([#351](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/351)) ([bc02ba2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/bc02ba296dbc1b77e479613017af7a62362995db))
* **deps:** bump ufo from 1.3.2 to 1.4.0 ([#259](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/259)) ([b7a7c9b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b7a7c9b0ca974f23952a014afff6c1b2dd58796a))
* dispaly median survival time on kp charts ([16f6f93](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/16f6f93ff2f0d21c455184ea48dc9867bf262acd))
* dropdown selection in summary grouped component ([cf9082a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/cf9082aee60bbb64444d49acdc7950376f3581a8))
* from select listener ([604ce41](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/604ce411a471f4a5c8d1c3468988750f3ba73700))
* minor adjustment for summary view ([572a5cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/572a5cbee163f398594497ae06e93b62e6572e25))
* mtb (sub-) forms & form-select-search component ([ae1a986](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ae1a986ed7990646e7eeaf95b21e470db1c4dde8))
* rendering api client issues & toast composable for errors and custom data ([ce66cb5](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ce66cb52e5e94d6e44ea43f2c62d8bd560acaea3))
* selection of first element in summary-grouped component ([#279](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/279)) ([5e9b122](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/5e9b122e0c4f1dc18309538717c0fc2e1a9d3229))
* some spelling issues ([e80f430](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80f430e65e0f18bc62b1dfd72a52429f6d12db9))

## [1.7.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.6.0...core-v1.7.0) (2024-03-13)


### Features

* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* implemented filters for valueset/codesystem entities ([36c771d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36c771d8953e5de41e8fc0038d6c575f8e20cb44))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* search select for visualisations ([51ced11](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/51ced119770b1de162c40bc1b15f5d11f300c5c2))

## [1.6.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.5.0...core-v1.6.0) (2024-03-07)


### Features

* add admin area with user- & role-management ([49ba49c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/49ba49c1e18c95121e49ee8ea68dd099a6fe13be))
* integrated authup in portal (store,components,pages,...) ([42937a8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/42937a8a41685f0e83b88d578db013fc5ed527e0))
* minor adjustments to patient-record view ([91bde67](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/91bde67e52b6bf7984f74090b4d00bc41dcd0f3a))

## [1.5.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.4.0...core-v1.5.0) (2024-02-29)


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))

## [1.4.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.3.0...core-v1.4.0) (2024-02-29)


### Features

* add expandable-content component & add patient record therapies tab ([05b4056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/05b4056f75aa21ea80dd33fd4accec8b8392a08c))
* implemented patient-record view ([ac72d56](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ac72d560bfa23206e816266879210281a62dd6f4))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* round percent values in charts to 1 fraction ([b9233b8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b9233b8145cacc275848edaae1e4e9141bae03ee))


### Bug Fixes

* dispaly median survival time on kp charts ([16f6f93](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/16f6f93ff2f0d21c455184ea48dc9867bf262acd))
* dropdown selection in summary grouped component ([cf9082a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/cf9082aee60bbb64444d49acdc7950376f3581a8))
* from select listener ([604ce41](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/604ce411a471f4a5c8d1c3468988750f3ba73700))
* selection of first element in summary-grouped component ([#279](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/279)) ([5e9b122](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/5e9b122e0c4f1dc18309538717c0fc2e1a9d3229))
* some spelling issues ([e80f430](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80f430e65e0f18bc62b1dfd72a52429f6d12db9))

## [1.3.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.2.0...core-v1.3.0) (2024-02-15)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))


### Bug Fixes

* build error due bar chat typings ([e53c51c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e53c51c5923045785d6f8fbe1631bf19bb226e00))
* **deps:** bump ufo from 1.3.2 to 1.4.0 ([#259](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/259)) ([b7a7c9b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b7a7c9b0ca974f23952a014afff6c1b2dd58796a))
* minor adjustment for summary view ([572a5cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/572a5cbee163f398594497ae06e93b62e6572e25))
* rendering api client issues & toast composable for errors and custom data ([ce66cb5](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ce66cb52e5e94d6e44ea43f2c62d8bd560acaea3))

## [1.2.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.1.3...core-v1.2.0) (2024-01-31)


### Features

* adjusted mtb search form (labels, checkboxes, ...) ([8bf3d6f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8bf3d6f55cb77cd355f1646e53495643296361ec))
* adjusted summary view according to api changes + minor style enhancements ([e1cf350](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e1cf35086c84a63fbb44168ac4014cf9464adc60))


### Bug Fixes

* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))

## [1.1.3](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.1.2...core-v1.1.3) (2024-01-25)


### Miscellaneous Chores

* **core:** Synchronize main versions

## [1.1.2](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.1.1...core-v1.1.2) (2024-01-25)


### Miscellaneous Chores

* **core:** Synchronize main versions

## [1.1.1](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.1.0...core-v1.1.1) (2024-01-25)


### Miscellaneous Chores

* **core:** Synchronize main versions

## [1.1.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/core-v1.0.0...core-v1.1.0) (2024-01-25)


### Features

* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* new kit package for registering modules + initial mtb module package ([71a8384](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/71a83848a3aeb5f633fea9172f5b423d3f58df20))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* replaced vue-layout with vuecs ([4e1c90d](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4e1c90d3dea4d7ddbff9f46221f10a4defac7bbb))


### Bug Fixes

* better naming for css classes ([c240266](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c2402662e2becc9c6bee60d63b8d8a8d771906db))
* **deps:** bump hapic from 2.4.0 to 2.5.0 ([#214](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/214)) ([01f5056](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/01f5056f95bd525bfbe8c515fee4161ea53fb644))
* mtb (sub-) forms & form-select-search component ([ae1a986](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ae1a986ed7990646e7eeaf95b21e470db1c4dde8))

## 1.0.0 (2023-12-21)


### Bug Fixes

* **deps:** bump hapic from 2.3.0 to 2.4.0 ([#141](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/141)) ([87ff43b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87ff43bd9501e638e91deede6dab8af68f2a84fb))

## 0.0.8

### Patch Changes

- [`55662f4`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/55662f4c4d9c8c80743626bd51ff157fc33eb8cd) Thanks [@tada5hi](https://github.com/tada5hi)! - release docker image

## 0.0.6

### Patch Changes

- [`a0792b2`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a0792b2919811f48b5b5a493fe40d863eef276d9) Thanks [@tada5hi](https://github.com/tada5hi)! - next patch release

## 0.0.5

### Patch Changes

- [`c03fb9e`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c03fb9e3388bef2c6098044b23d5a229e8d88e49) Thanks [@tada5hi](https://github.com/tada5hi)! - next patch release

## 0.0.4

### Patch Changes

- [`1dc37fd`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1dc37fd15da4bd3f73e4922d70eb27e1a6d0ef9e) Thanks [@tada5hi](https://github.com/tada5hi)! - docker release attempt

## 0.0.3

### Patch Changes

- [`3a3421f`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3a3421f3ba2a685ce3bb320a76dfbad577aa755b) Thanks [@tada5hi](https://github.com/tada5hi)! - force publish

## 0.0.2

### Patch Changes

- [`f7b1347`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f7b1347b936dbf2c81e58b6dd8f9938fbfeeec75) Thanks [@tada5hi](https://github.com/tada5hi)! - docker release

## 0.0.1

### Patch Changes

- [`17c894a`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/17c894a2a176ced67461be77bdb94ac3281241ed) Thanks [@tada5hi](https://github.com/tada5hi)! - initial release
