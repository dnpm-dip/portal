# @dnpm-dip/rare-diseases

## [1.16.2](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.16.1...v1.16.2) (2024-07-29)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.16.0 to ^1.17.0
    * @dnpm-dip/kit bumped from ^1.12.2 to ^1.13.0

## [1.16.1](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.16.0...v1.16.1) (2024-07-23)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/kit bumped from ^1.12.1 to ^1.12.2

## [1.16.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.15.0...v1.16.0) (2024-07-19)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted rd dtos and variant view ([d3b0c66](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d3b0c667a3c782c3818454f0582f45df1dd3687f))
* align rd and mtb view ([4443732](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/44437321700e0fcd25c99e239066209fd7d25c9e))
* assume query criteria is null or undefined ([66e21a4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/66e21a4b893428d50f8c67f5167feca88c96f5cb))
* avoid modifying chip array multiple times ([#620](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/620)) ([851d2bd](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/851d2bd7a5454558630b54829a8264d751cf268a))
* bump authup & vuecs dependencies ([f9fc12b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f9fc12bcb427e2fb1a4eff0f31dd52ba19a5d410))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* create component for {small,structural,copyNumber}-variant ([d963f8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d963f8c6c2ce73e9721f843b45ba303c7d9153fc))
* enhanced summary diagnostics view & adjusted type structure ([f72a826](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f72a82646c8af79764d013ce8d6a6324b71c0cd1))
* implemeneted infinite-scroll for form-slect-search fields ([#530](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/530)) ([36dec87](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36dec87edee8482a14ff395743dbe08b1c5ccb98))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented validation for protein change inputs ([#471](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/471)) ([0c38990](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/0c38990f9a6c40ed5ca89ec3925b75cf0cfc4a2f))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial implementaion of query info page ([#507](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/507)) ([1a5a797](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1a5a7972c2864ee240c4bad9bba50040cb939ec5))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* initial permission implementation for rd & mtb use case ([9c58cf1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9c58cf1c401e68fad4db52480cc25185e7046d4a))
* initial refactoring of module registration ([70467ff](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/70467ffe45acf1423d1085122e94a0337df3ee58))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* modal search ([#587](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/587)) ([7260a60](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/7260a602f52e74c0389237dfa7b2825754cffd9a))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* only display use-case modules on home screen ([2c468f3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2c468f3f159bdd08197a56ef7a90c8600b6858c0))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* set search form to full width ([1302025](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1302025255f466dad9a32ff4a9348e30a1ae9af6))
* simplified api singleton management ([15955cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/15955cb28b7cf311510b260d70cc9ade74d9f709))
* support multiple catalogs for rd disease category ([60c558e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/60c558ee8f70eaea9779535ab49cec1a51c8b3b1))


### Bug Fixes

* adjusted dtos to breaking backend changes ([29fb1c1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/29fb1c1fde9d2e5edb8cd4179ba6313d11fc6172))
* adjusted mtb & rd (type-) structure ([e80bd45](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80bd45b7543dc3baf2a26d077af5111fbf1a5df))
* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* change workflow execution steps ([87f397e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87f397e9259e512d40970a57ad58caca87148b5e))
* **deps:** bump @authup/client-web-kit ([#560](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/560)) ([8417cec](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8417cece735865bb994510d67c33ffb3f8fad950))
* **deps:** bump @authup/client-web-kit ([#574](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/574)) ([9b574fe](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9b574fea5b905d4f3fd08312e43f5101934f527c))
* **deps:** bump bootstrap-vue-next from 0.20.0 to 0.21.0 ([#504](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/504)) ([8b40b91](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8b40b91907ffbda606570e8008ecc4b5343e939c))
* **deps:** bump bootstrap-vue-next from 0.21.0 to 0.21.2 ([#519](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/519)) ([d0fffb2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d0fffb2e4980654751f1d6866312f211860ed381))
* **deps:** bump bootstrap-vue-next from 0.21.2 to 0.22.1 ([#548](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/548)) ([1839a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1839a77d6642481952fb512031d7829260100459))
* **deps:** bump bootstrap-vue-next from 0.22.1 to 0.22.2 ([#565](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/565)) ([742919b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/742919b0534ffaded3a29c21fe8be2d87d59109f))
* **deps:** bump bootstrap-vue-next from 0.22.2 to 0.23.5 ([#609](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/609)) ([0e1aed3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/0e1aed385a77b9807e3c5aef03025e01e209014a))
* **deps:** bump bootstrap-vue-next from 0.23.5 to 0.24.0 ([#622](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/622)) ([c980fe3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c980fe3276989dafe0d5ca981412dbb49404b13c))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* **deps:** bump vue from 3.4.29 to 3.4.30 ([#556](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/556)) ([ba37564](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ba375640edd7ec28f6d19b8c6eeca4f7b10e11c8))
* **deps:** bump vue from 3.4.30 to 3.4.32 ([#617](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/617)) ([c0f0fa8](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c0f0fa8bf71086188baea51b7330cb640f83b12b))
* disease category submission in rd modul ([4b623fb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4b623fb85978ca3918af730dea4cea69a627dfaf))
* hot fix for admin section ([dfafc8a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dfafc8ab4130001e260d718093dbd9272fadfc99))
* layout in mtb and rd module ([b968ac9](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b968ac9e58f25fdb294698ee08ad0dea794c07ca))
* minor changes to bump version ([a716868](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a7168681078dae8550c04fe06475b1561560d718))
* other minor modification for patien-record schema ([de680c6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/de680c62f6d5bcd36fd9e556f9ffe8580e1ed898))
* patient record episodes rendering ([63363d3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63363d30f68628ba358b89f58ca90a9fc3fdacf5))
* rd patient record overview view ([fb3d88c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/fb3d88cc9a2280e53c90d31fab832ef6d98fe50f))
* redirect in rd query record page ([277f426](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/277f426bed151ce26f82678d4d2ba41f020682e5))
* set rd ngs-report list item width to 100% ([2884ddc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2884ddcf2d856cb03c81764bffa028fe407a30be))
* tags view in rd search form ([a514a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a514a773e760c694af7a95d40bc61fbab93b5a76))
* use type instead of enum import in module definition ([1ed5ae3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1ed5ae3b330cae5ed800f3c842a528a8142843cb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.15.0 to ^1.16.0
    * @dnpm-dip/kit bumped from ^1.12.0 to ^1.12.1

## [1.15.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.14.0...v1.15.0) (2024-07-04)


### Features

* modal search ([#587](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/587)) ([7260a60](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/7260a602f52e74c0389237dfa7b2825754cffd9a))


### Bug Fixes

* adjusted mtb & rd (type-) structure ([e80bd45](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80bd45b7543dc3baf2a26d077af5111fbf1a5df))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.14.0 to ^1.15.0

## [1.14.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.13.2...v1.14.0) (2024-07-01)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted rd dtos and variant view ([d3b0c66](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d3b0c667a3c782c3818454f0582f45df1dd3687f))
* align rd and mtb view ([4443732](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/44437321700e0fcd25c99e239066209fd7d25c9e))
* bump authup & vuecs dependencies ([f9fc12b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f9fc12bcb427e2fb1a4eff0f31dd52ba19a5d410))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* create component for {small,structural,copyNumber}-variant ([d963f8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d963f8c6c2ce73e9721f843b45ba303c7d9153fc))
* enhanced summary diagnostics view & adjusted type structure ([f72a826](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f72a82646c8af79764d013ce8d6a6324b71c0cd1))
* implemeneted infinite-scroll for form-slect-search fields ([#530](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/530)) ([36dec87](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36dec87edee8482a14ff395743dbe08b1c5ccb98))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented validation for protein change inputs ([#471](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/471)) ([0c38990](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/0c38990f9a6c40ed5ca89ec3925b75cf0cfc4a2f))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial implementaion of query info page ([#507](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/507)) ([1a5a797](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1a5a7972c2864ee240c4bad9bba50040cb939ec5))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* initial permission implementation for rd & mtb use case ([9c58cf1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9c58cf1c401e68fad4db52480cc25185e7046d4a))
* initial refactoring of module registration ([70467ff](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/70467ffe45acf1423d1085122e94a0337df3ee58))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* only display use-case modules on home screen ([2c468f3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2c468f3f159bdd08197a56ef7a90c8600b6858c0))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* set search form to full width ([1302025](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1302025255f466dad9a32ff4a9348e30a1ae9af6))
* simplified api singleton management ([15955cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/15955cb28b7cf311510b260d70cc9ade74d9f709))
* support multiple catalogs for rd disease category ([60c558e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/60c558ee8f70eaea9779535ab49cec1a51c8b3b1))


### Bug Fixes

* adjusted dtos to breaking backend changes ([29fb1c1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/29fb1c1fde9d2e5edb8cd4179ba6313d11fc6172))
* adjusted mtb & rd (type-) structure ([e80bd45](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/e80bd45b7543dc3baf2a26d077af5111fbf1a5df))
* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* change workflow execution steps ([87f397e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87f397e9259e512d40970a57ad58caca87148b5e))
* **deps:** bump @authup/client-web-kit ([#560](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/560)) ([8417cec](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8417cece735865bb994510d67c33ffb3f8fad950))
* **deps:** bump @authup/client-web-kit ([#574](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/574)) ([9b574fe](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9b574fea5b905d4f3fd08312e43f5101934f527c))
* **deps:** bump bootstrap-vue-next from 0.20.0 to 0.21.0 ([#504](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/504)) ([8b40b91](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8b40b91907ffbda606570e8008ecc4b5343e939c))
* **deps:** bump bootstrap-vue-next from 0.21.0 to 0.21.2 ([#519](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/519)) ([d0fffb2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d0fffb2e4980654751f1d6866312f211860ed381))
* **deps:** bump bootstrap-vue-next from 0.21.2 to 0.22.1 ([#548](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/548)) ([1839a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1839a77d6642481952fb512031d7829260100459))
* **deps:** bump bootstrap-vue-next from 0.22.1 to 0.22.2 ([#565](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/565)) ([742919b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/742919b0534ffaded3a29c21fe8be2d87d59109f))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* **deps:** bump vue from 3.4.29 to 3.4.30 ([#556](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/556)) ([ba37564](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ba375640edd7ec28f6d19b8c6eeca4f7b10e11c8))
* disease category submission in rd modul ([4b623fb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4b623fb85978ca3918af730dea4cea69a627dfaf))
* hot fix for admin section ([dfafc8a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dfafc8ab4130001e260d718093dbd9272fadfc99))
* layout in mtb and rd module ([b968ac9](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b968ac9e58f25fdb294698ee08ad0dea794c07ca))
* minor changes to bump version ([a716868](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a7168681078dae8550c04fe06475b1561560d718))
* other minor modification for patien-record schema ([de680c6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/de680c62f6d5bcd36fd9e556f9ffe8580e1ed898))
* patient record episodes rendering ([63363d3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63363d30f68628ba358b89f58ca90a9fc3fdacf5))
* rd patient record overview view ([fb3d88c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/fb3d88cc9a2280e53c90d31fab832ef6d98fe50f))
* redirect in rd query record page ([277f426](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/277f426bed151ce26f82678d4d2ba41f020682e5))
* set rd ngs-report list item width to 100% ([2884ddc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2884ddcf2d856cb03c81764bffa028fe407a30be))
* tags view in rd search form ([a514a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a514a773e760c694af7a95d40bc61fbab93b5a76))
* use type instead of enum import in module definition ([1ed5ae3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1ed5ae3b330cae5ed800f3c842a528a8142843cb))

## [1.13.2](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.13.1...v1.13.2) (2024-07-01)


### Bug Fixes

* **deps:** bump @authup/client-web-kit ([#560](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/560)) ([8417cec](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8417cece735865bb994510d67c33ffb3f8fad950))
* **deps:** bump @authup/client-web-kit ([#574](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/574)) ([9b574fe](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9b574fea5b905d4f3fd08312e43f5101934f527c))
* **deps:** bump bootstrap-vue-next from 0.21.2 to 0.22.1 ([#548](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/548)) ([1839a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1839a77d6642481952fb512031d7829260100459))
* **deps:** bump bootstrap-vue-next from 0.22.1 to 0.22.2 ([#565](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/565)) ([742919b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/742919b0534ffaded3a29c21fe8be2d87d59109f))
* **deps:** bump vue from 3.4.29 to 3.4.30 ([#556](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/556)) ([ba37564](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ba375640edd7ec28f6d19b8c6eeca4f7b10e11c8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.13.1 to ^1.14.0

## [1.13.1](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.13.0...v1.13.1) (2024-06-24)


### Bug Fixes

* adjusted dtos to breaking backend changes ([29fb1c1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/29fb1c1fde9d2e5edb8cd4179ba6313d11fc6172))
* other minor modification for patien-record schema ([de680c6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/de680c62f6d5bcd36fd9e556f9ffe8580e1ed898))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.13.0 to ^1.13.1

## [1.13.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.12.0...v1.13.0) (2024-06-17)


### Features

* implemeneted infinite-scroll for form-slect-search fields ([#530](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/530)) ([36dec87](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/36dec87edee8482a14ff395743dbe08b1c5ccb98))


### Bug Fixes

* **deps:** bump bootstrap-vue-next from 0.21.0 to 0.21.2 ([#519](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/519)) ([d0fffb2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d0fffb2e4980654751f1d6866312f211860ed381))
* hot fix for admin section ([dfafc8a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dfafc8ab4130001e260d718093dbd9272fadfc99))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.12.1 to ^1.13.0

## [1.12.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.11.0...v1.12.0) (2024-06-07)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted rd dtos and variant view ([d3b0c66](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d3b0c667a3c782c3818454f0582f45df1dd3687f))
* align rd and mtb view ([4443732](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/44437321700e0fcd25c99e239066209fd7d25c9e))
* bump authup & vuecs dependencies ([f9fc12b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f9fc12bcb427e2fb1a4eff0f31dd52ba19a5d410))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* create component for {small,structural,copyNumber}-variant ([d963f8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d963f8c6c2ce73e9721f843b45ba303c7d9153fc))
* enhanced summary diagnostics view & adjusted type structure ([f72a826](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f72a82646c8af79764d013ce8d6a6324b71c0cd1))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented validation for protein change inputs ([#471](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/471)) ([0c38990](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/0c38990f9a6c40ed5ca89ec3925b75cf0cfc4a2f))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial implementaion of query info page ([#507](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/507)) ([1a5a797](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1a5a7972c2864ee240c4bad9bba50040cb939ec5))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* initial permission implementation for rd & mtb use case ([9c58cf1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9c58cf1c401e68fad4db52480cc25185e7046d4a))
* initial refactoring of module registration ([70467ff](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/70467ffe45acf1423d1085122e94a0337df3ee58))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* only display use-case modules on home screen ([2c468f3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2c468f3f159bdd08197a56ef7a90c8600b6858c0))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* set search form to full width ([1302025](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1302025255f466dad9a32ff4a9348e30a1ae9af6))
* simplified api singleton management ([15955cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/15955cb28b7cf311510b260d70cc9ade74d9f709))
* support multiple catalogs for rd disease category ([60c558e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/60c558ee8f70eaea9779535ab49cec1a51c8b3b1))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* change workflow execution steps ([87f397e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87f397e9259e512d40970a57ad58caca87148b5e))
* **deps:** bump bootstrap-vue-next from 0.20.0 to 0.21.0 ([#504](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/504)) ([8b40b91](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8b40b91907ffbda606570e8008ecc4b5343e939c))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* disease category submission in rd modul ([4b623fb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4b623fb85978ca3918af730dea4cea69a627dfaf))
* hot fix for admin section ([dfafc8a](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dfafc8ab4130001e260d718093dbd9272fadfc99))
* layout in mtb and rd module ([b968ac9](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b968ac9e58f25fdb294698ee08ad0dea794c07ca))
* minor changes to bump version ([a716868](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a7168681078dae8550c04fe06475b1561560d718))
* patient record episodes rendering ([63363d3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63363d30f68628ba358b89f58ca90a9fc3fdacf5))
* rd patient record overview view ([fb3d88c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/fb3d88cc9a2280e53c90d31fab832ef6d98fe50f))
* redirect in rd query record page ([277f426](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/277f426bed151ce26f82678d4d2ba41f020682e5))
* set rd ngs-report list item width to 100% ([2884ddc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2884ddcf2d856cb03c81764bffa028fe407a30be))
* tags view in rd search form ([a514a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a514a773e760c694af7a95d40bc61fbab93b5a76))
* use type instead of enum import in module definition ([1ed5ae3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1ed5ae3b330cae5ed800f3c842a528a8142843cb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.12.0 to ^1.12.1
    * @dnpm-dip/kit bumped from ^1.11.0 to ^1.12.0

## [1.11.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.10.1...v1.11.0) (2024-06-07)


### Features

* initial implementaion of query info page ([#507](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/507)) ([1a5a797](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1a5a7972c2864ee240c4bad9bba50040cb939ec5))
* initial permission implementation for rd & mtb use case ([9c58cf1](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/9c58cf1c401e68fad4db52480cc25185e7046d4a))
* initial refactoring of module registration ([70467ff](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/70467ffe45acf1423d1085122e94a0337df3ee58))
* only display use-case modules on home screen ([2c468f3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2c468f3f159bdd08197a56ef7a90c8600b6858c0))


### Bug Fixes

* **deps:** bump bootstrap-vue-next from 0.20.0 to 0.21.0 ([#504](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/504)) ([8b40b91](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8b40b91907ffbda606570e8008ecc4b5343e939c))
* use type instead of enum import in module definition ([1ed5ae3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1ed5ae3b330cae5ed800f3c842a528a8142843cb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.11.0 to ^1.12.0
    * @dnpm-dip/kit bumped from ^1.10.0 to ^1.11.0

## [1.10.1](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.10.0...v1.10.1) (2024-05-21)


### Bug Fixes

* disease category submission in rd modul ([4b623fb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4b623fb85978ca3918af730dea4cea69a627dfaf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.10.0 to ^1.11.0

## [1.10.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.9.0...v1.10.0) (2024-05-21)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted rd dtos and variant view ([d3b0c66](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d3b0c667a3c782c3818454f0582f45df1dd3687f))
* align rd and mtb view ([4443732](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/44437321700e0fcd25c99e239066209fd7d25c9e))
* bump authup & vuecs dependencies ([f9fc12b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f9fc12bcb427e2fb1a4eff0f31dd52ba19a5d410))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* create component for {small,structural,copyNumber}-variant ([d963f8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d963f8c6c2ce73e9721f843b45ba303c7d9153fc))
* enhanced summary diagnostics view & adjusted type structure ([f72a826](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f72a82646c8af79764d013ce8d6a6324b71c0cd1))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* implemented validation for protein change inputs ([#471](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/471)) ([0c38990](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/0c38990f9a6c40ed5ca89ec3925b75cf0cfc4a2f))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* set search form to full width ([1302025](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1302025255f466dad9a32ff4a9348e30a1ae9af6))
* simplified api singleton management ([15955cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/15955cb28b7cf311510b260d70cc9ade74d9f709))
* support multiple catalogs for rd disease category ([60c558e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/60c558ee8f70eaea9779535ab49cec1a51c8b3b1))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* change workflow execution steps ([87f397e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87f397e9259e512d40970a57ad58caca87148b5e))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* layout in mtb and rd module ([b968ac9](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b968ac9e58f25fdb294698ee08ad0dea794c07ca))
* minor changes to bump version ([a716868](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a7168681078dae8550c04fe06475b1561560d718))
* patient record episodes rendering ([63363d3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63363d30f68628ba358b89f58ca90a9fc3fdacf5))
* rd patient record overview view ([fb3d88c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/fb3d88cc9a2280e53c90d31fab832ef6d98fe50f))
* redirect in rd query record page ([277f426](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/277f426bed151ce26f82678d4d2ba41f020682e5))
* set rd ngs-report list item width to 100% ([2884ddc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2884ddcf2d856cb03c81764bffa028fe407a30be))
* tags view in rd search form ([a514a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a514a773e760c694af7a95d40bc61fbab93b5a76))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.9.0 to ^1.10.0
    * @dnpm-dip/kit bumped from ^1.9.0 to ^1.10.0

## [1.9.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.8.0...rd-v1.9.0) (2024-05-17)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted rd dtos and variant view ([d3b0c66](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d3b0c667a3c782c3818454f0582f45df1dd3687f))
* align rd and mtb view ([4443732](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/44437321700e0fcd25c99e239066209fd7d25c9e))
* bump authup & vuecs dependencies ([f9fc12b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f9fc12bcb427e2fb1a4eff0f31dd52ba19a5d410))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* create component for {small,structural,copyNumber}-variant ([d963f8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d963f8c6c2ce73e9721f843b45ba303c7d9153fc))
* enhanced summary diagnostics view & adjusted type structure ([f72a826](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f72a82646c8af79764d013ce8d6a6324b71c0cd1))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* reimplemented plugin (http-client, ...) installation and procedure ([#465](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/465)) ([dc1af34](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/dc1af345e5509f60a9f0a8deda678e0af5ac2f4f))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* set search form to full width ([1302025](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1302025255f466dad9a32ff4a9348e30a1ae9af6))
* simplified api singleton management ([15955cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/15955cb28b7cf311510b260d70cc9ade74d9f709))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* change workflow execution steps ([87f397e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87f397e9259e512d40970a57ad58caca87148b5e))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* layout in mtb and rd module ([b968ac9](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b968ac9e58f25fdb294698ee08ad0dea794c07ca))
* minor changes to bump version ([a716868](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a7168681078dae8550c04fe06475b1561560d718))
* patient record episodes rendering ([63363d3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63363d30f68628ba358b89f58ca90a9fc3fdacf5))
* rd patient record overview view ([fb3d88c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/fb3d88cc9a2280e53c90d31fab832ef6d98fe50f))
* redirect in rd query record page ([277f426](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/277f426bed151ce26f82678d4d2ba41f020682e5))
* set rd ngs-report list item width to 100% ([2884ddc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2884ddcf2d856cb03c81764bffa028fe407a30be))
* tags view in rd search form ([a514a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a514a773e760c694af7a95d40bc61fbab93b5a76))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.8.0 to ^1.9.0
    * @dnpm-dip/kit bumped from ^1.8.0 to ^1.9.0

## [1.8.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/v1.7.0...v1.8.0) (2024-05-09)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* adjusted rd dtos and variant view ([d3b0c66](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d3b0c667a3c782c3818454f0582f45df1dd3687f))
* align rd and mtb view ([4443732](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/44437321700e0fcd25c99e239066209fd7d25c9e))
* bump authup & vuecs dependencies ([f9fc12b](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f9fc12bcb427e2fb1a4eff0f31dd52ba19a5d410))
* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* create component for {small,structural,copyNumber}-variant ([d963f8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d963f8c6c2ce73e9721f843b45ba303c7d9153fc))
* enhanced summary diagnostics view & adjusted type structure ([f72a826](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f72a82646c8af79764d013ce8d6a6324b71c0cd1))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* set search form to full width ([1302025](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1302025255f466dad9a32ff4a9348e30a1ae9af6))
* simplified api singleton management ([15955cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/15955cb28b7cf311510b260d70cc9ade74d9f709))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* change workflow execution steps ([87f397e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87f397e9259e512d40970a57ad58caca87148b5e))
* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))
* **deps:** bump nuxt to v3.11.1 ([56b6c82](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56b6c82db62519db6edc40ebb33cfceb10e9dedf))
* layout in mtb and rd module ([b968ac9](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b968ac9e58f25fdb294698ee08ad0dea794c07ca))
* minor changes to bump version ([a716868](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a7168681078dae8550c04fe06475b1561560d718))
* patient record episodes rendering ([63363d3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63363d30f68628ba358b89f58ca90a9fc3fdacf5))
* rd patient record overview view ([fb3d88c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/fb3d88cc9a2280e53c90d31fab832ef6d98fe50f))
* redirect in rd query record page ([277f426](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/277f426bed151ce26f82678d4d2ba41f020682e5))
* set rd ngs-report list item width to 100% ([2884ddc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2884ddcf2d856cb03c81764bffa028fe407a30be))
* tags view in rd search form ([a514a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a514a773e760c694af7a95d40bc61fbab93b5a76))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.7.0 to ^1.8.0
    * @dnpm-dip/kit bumped from ^1.7.0 to ^1.8.0

## [1.7.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.6.0...rd-v1.7.0) (2024-03-13)


### Features

* consistent component naming + minor style and component issues ([#323](https://github.com/KohlbacherLab/dnpm-dip-portal/issues/323)) ([2ed563e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2ed563ed71ce36551852bcd57b7909fb9dd2690e))
* remove components & upgraded vuecs/form-controls ([ff634f2](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ff634f20283f743c79a3938e4878210e64b56b20))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.6.0 to ^1.7.0
    * @dnpm-dip/kit bumped from ^1.6.0 to ^1.7.0

## [1.6.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.5.0...rd-v1.6.0) (2024-03-07)


### Features

* adjusted rd dtos and variant view ([d3b0c66](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d3b0c667a3c782c3818454f0582f45df1dd3687f))
* create component for {small,structural,copyNumber}-variant ([d963f8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d963f8c6c2ce73e9721f843b45ba303c7d9153fc))
* set search form to full width ([1302025](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1302025255f466dad9a32ff4a9348e30a1ae9af6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.5.0 to ^1.6.0
    * @dnpm-dip/kit bumped from ^1.5.0 to ^1.6.0

## [1.5.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.4.0...rd-v1.5.0) (2024-02-29)


### Features

* align rd and mtb view ([4443732](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/44437321700e0fcd25c99e239066209fd7d25c9e))


### Bug Fixes

* align headings ([63815a7](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63815a787356eef720d06dadecbf6c565d6d88a7))
* rd patient record overview view ([fb3d88c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/fb3d88cc9a2280e53c90d31fab832ef6d98fe50f))
* set rd ngs-report list item width to 100% ([2884ddc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2884ddcf2d856cb03c81764bffa028fe407a30be))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.4.0 to ^1.5.0
    * @dnpm-dip/kit bumped from ^1.4.0 to ^1.5.0

## [1.4.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.3.0...rd-v1.4.0) (2024-02-29)


### Features

* initial mtb patient-record view ([ec58fbc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/ec58fbcfe855546bb8eee80ec86c94a34489c642))
* kaplan-meier survival statistics ([56de499](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/56de499a739c62c28db06101507b237af3ac1beb))


### Bug Fixes

* layout in mtb and rd module ([b968ac9](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b968ac9e58f25fdb294698ee08ad0dea794c07ca))
* patient record episodes rendering ([63363d3](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/63363d30f68628ba358b89f58ca90a9fc3fdacf5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.3.0 to ^1.4.0
    * @dnpm-dip/kit bumped from ^1.3.0 to ^1.4.0

## [1.3.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.2.0...rd-v1.3.0) (2024-02-15)


### Features

* adjusted and optimized rd query filters for global usage ([90aa6dc](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/90aa6dce69b1adc2799258f68249b2ed9ada79f9))
* implemented global filter for mtb ([b74ca4f](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/b74ca4fe5deb4bc3c48c90390e401ccbc5ff7a5f))
* initial global filters for query views ([d127ef6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/d127ef6f87e420e4c9afd997247f62d6067888a7))
* initial patient-list & enable modification of query search ([108a3ee](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/108a3eefef45b4b191cb060e391eacdf57976f7a))


### Bug Fixes

* redirect in rd query record page ([277f426](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/277f426bed151ce26f82678d4d2ba41f020682e5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.2.0 to ^1.3.0
    * @dnpm-dip/kit bumped from ^1.2.0 to ^1.3.0

## [1.2.0](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.1.3...rd-v1.2.0) (2024-01-31)


### Features

* enhanced summary diagnostics view & adjusted type structure ([f72a826](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f72a82646c8af79764d013ce8d6a6324b71c0cd1))


### Bug Fixes

* **deps:** bump nuxt and reset lock file ([8de5687](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8de5687a1a170877b15f0e1ec3bd20147b0b72d8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.1.3 to ^1.2.0
    * @dnpm-dip/kit bumped from ^1.1.3 to ^1.2.0

## [1.1.3](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.1.2...rd-v1.1.3) (2024-01-25)


### Bug Fixes

* change workflow execution steps ([87f397e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/87f397e9259e512d40970a57ad58caca87148b5e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.1.2 to ^1.1.3
    * @dnpm-dip/kit bumped from ^1.1.2 to ^1.1.3

## [1.1.2](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.1.1...rd-v1.1.2) (2024-01-25)


### Miscellaneous Chores

* **rd:** Synchronize main versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.1.1 to ^1.1.2
    * @dnpm-dip/kit bumped from ^1.1.1 to ^1.1.2

## [1.1.1](https://github.com/KohlbacherLab/dnpm-dip-portal/compare/rd-v1.1.0...rd-v1.1.1) (2024-01-25)


### Bug Fixes

* minor changes to bump version ([a716868](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a7168681078dae8550c04fe06475b1561560d718))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.1.0 to ^1.1.1
    * @dnpm-dip/kit bumped from ^1.1.0 to ^1.1.1

## 1.1.0 (2024-01-25)


### Features

* implemented internal mtb form logic and state management ([6197be4](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6197be47515f1efe0a870877baa7c2d3eb704669))
* initial final summary view for mtb and rd ([f89e085](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f89e08506fd7866d7fc39d1c3b690ecf033c4e63))
* initial mtb domains, pages etc + initial type refactoring + fix page schema generation ([2befba6](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/2befba6ed6e169e5c88c8038985ca7d10ed0ded5))
* initial mtb form elements/components ([8fd3720](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8fd3720fd65ab808307814233e9a184603d23d40))
* move and prefix core components with letter D ([becfa81](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/becfa815683c284da58d899d5de0efbb36261619))
* refactoring summary logic ([4d41987](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4d4198738864b7370fc96e18192ec351fc49fe3d))
* remove RD prefix of rd domains ([8ca6949](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/8ca69498ea13bc1e9339d6e0be9af8044e8cafd7))
* simplified api singleton management ([15955cb](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/15955cb28b7cf311510b260d70cc9ade74d9f709))


### Bug Fixes

* tags view in rd search form ([a514a77](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a514a773e760c694af7a95d40bc61fbab93b5a76))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^1.0.0 to ^1.1.0
    * @dnpm-dip/kit bumped from ^0.0.0 to ^1.1.0

## 1.0.0 (2023-12-21)


### Features

* multi variant select support ([805259e](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/805259e75f21ff60492f4a5b1bfe955906f91f4a))
* multi variant select support ([6671243](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/6671243d0ee349f6933b8a172a1fec3a8a338278))


### Bug Fixes

* form-tab-groups component ([17f2994](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/17f2994792c1ea089ab4cd2819d3f6a3e17cbc2a))
* minor changes for query summary ([4355b8c](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/4355b8c91944631226be4a2da39bb6e792f56196))
* summary view ([a917572](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a917572275187d76a30f431ece2d4859f02a81a1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/core bumped from ^0.0.8 to ^1.0.0

## 0.0.8

### Patch Changes

- [`55662f4`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/55662f4c4d9c8c80743626bd51ff157fc33eb8cd) Thanks [@tada5hi](https://github.com/tada5hi)! - release docker image

- Updated dependencies [[`55662f4`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/55662f4c4d9c8c80743626bd51ff157fc33eb8cd)]:
  - @dnpm-dip/core@0.0.8

## 0.0.7

### Patch Changes

- [`299ef49`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/299ef49d7099d46dfbbe5958052c9ae84d4f80c1) Thanks [@tada5hi](https://github.com/tada5hi)! - patch version

## 0.0.6

### Patch Changes

- [`a0792b2`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a0792b2919811f48b5b5a493fe40d863eef276d9) Thanks [@tada5hi](https://github.com/tada5hi)! - next patch release

- Updated dependencies [[`a0792b2`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/a0792b2919811f48b5b5a493fe40d863eef276d9)]:
  - @dnpm-dip/core@0.0.6

## 0.0.5

### Patch Changes

- [`c03fb9e`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c03fb9e3388bef2c6098044b23d5a229e8d88e49) Thanks [@tada5hi](https://github.com/tada5hi)! - next patch release

- Updated dependencies [[`c03fb9e`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/c03fb9e3388bef2c6098044b23d5a229e8d88e49)]:
  - @dnpm-dip/core@0.0.5

## 0.0.4

### Patch Changes

- [`1dc37fd`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1dc37fd15da4bd3f73e4922d70eb27e1a6d0ef9e) Thanks [@tada5hi](https://github.com/tada5hi)! - docker release attempt

- Updated dependencies [[`1dc37fd`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/1dc37fd15da4bd3f73e4922d70eb27e1a6d0ef9e)]:
  - @dnpm-dip/core@0.0.4

## 0.0.3

### Patch Changes

- [`3a3421f`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3a3421f3ba2a685ce3bb320a76dfbad577aa755b) Thanks [@tada5hi](https://github.com/tada5hi)! - force publish

- Updated dependencies [[`3a3421f`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/3a3421f3ba2a685ce3bb320a76dfbad577aa755b)]:
  - @dnpm-dip/core@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [[`f7b1347`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/f7b1347b936dbf2c81e58b6dd8f9938fbfeeec75)]:
  - @dnpm-dip/core@0.0.2

## 0.0.1

### Patch Changes

- [`17c894a`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/17c894a2a176ced67461be77bdb94ac3281241ed) Thanks [@tada5hi](https://github.com/tada5hi)! - initial release

- Updated dependencies [[`17c894a`](https://github.com/KohlbacherLab/dnpm-dip-portal/commit/17c894a2a176ced67461be77bdb94ac3281241ed)]:
  - @dnpm-dip/core@0.0.1
