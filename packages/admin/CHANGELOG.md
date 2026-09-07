# Changelog

## [2.0.0](https://github.com/dnpm-dip/portal/compare/v1.10.1...v2.0.0) (2026-09-07)


### ⚠ BREAKING CHANGES

* **ui:** retire Bootstrap-compat layer for VC components + Tailwind ([#1243](https://github.com/dnpm-dip/portal/issues/1243))
* **ui:** @dnpm-dip/core no longer exports DNav and the nav helper module.

### Features

* add display_name & description to role-, user- & permission-assignment ([170c8d3](https://github.com/dnpm-dip/portal/commit/170c8d3fded84e8c9322034546d80a3d38f41420))
* adjusted code base to new permission names ([0127cfd](https://github.com/dnpm-dip/portal/commit/0127cfd02c9da6102e989fcadd8e3409ad601a94))
* adjusted code base to new version of authup dependencies ([1da44b8](https://github.com/dnpm-dip/portal/commit/1da44b8f2ab7d7ec29350d59e8319dfcb1db96d2))
* **admin:** add client management views ([#1267](https://github.com/dnpm-dip/portal/issues/1267)) ([80e7f62](https://github.com/dnpm-dip/portal/commit/80e7f6265c258030b1d637cdcdfc53a4743677b0))
* bump authup & common token hook ([26df00d](https://github.com/dnpm-dip/portal/commit/26df00dc87e3c07ec47d9268187d68cc975d0dca))
* bump authup & vuecs packages ([6e433a3](https://github.com/dnpm-dip/portal/commit/6e433a3633f81cf2ef384a30f462e1cadd6ab0c2))
* bump nuxt to v3.13.0 and fixed pages ([ad4c47b](https://github.com/dnpm-dip/portal/commit/ad4c47bc438f68b8c848c8547ae1313db98f6fd7))
* dedicated admin module/package ([#499](https://github.com/dnpm-dip/portal/issues/499)) ([ff07176](https://github.com/dnpm-dip/portal/commit/ff0717649e9cdb18099256be79a37cc8765b866d))
* migrate UI to rapiq v2 and [@authup](https://github.com/authup) beta.54 ([#1270](https://github.com/dnpm-dip/portal/issues/1270)) ([a5e3c4c](https://github.com/dnpm-dip/portal/commit/a5e3c4c7077a592bd0b57705d86d1efb9b84a921)), closes [#1269](https://github.com/dnpm-dip/portal/issues/1269)
* migrated to authup v1.0.0-beta.25 ([d30b4d4](https://github.com/dnpm-dip/portal/commit/d30b4d4e1057aac9ecfafb2a95cedcce97866633))
* mvh changes ([#1045](https://github.com/dnpm-dip/portal/issues/1045)) ([910ad96](https://github.com/dnpm-dip/portal/commit/910ad96c153648807ba7a8f5bad5174ee4c0f363))
* **portal:** OAuth2 authorization-code (PKCE) login ([#1252](https://github.com/dnpm-dip/portal/issues/1252)) ([2070f24](https://github.com/dnpm-dip/portal/commit/2070f248178ce2780f243674342fb3621a079e3a))
* refactored admin connection-report view ([#955](https://github.com/dnpm-dip/portal/issues/955)) ([c232455](https://github.com/dnpm-dip/portal/commit/c232455c0219348c64dc163a015ae275be3b68e6))
* simplified admin table views & break sites row ([#942](https://github.com/dnpm-dip/portal/issues/942)) ([94a3084](https://github.com/dnpm-dip/portal/commit/94a3084d36cf9dc4ad7a8843760390cfb378cd22))
* simplified plugin dependency definiton & fixed meta-box + navigation rendering ([6047d05](https://github.com/dnpm-dip/portal/commit/6047d05b2bd68c501b04276c70d9461f7cf5d37a))
* **ui:** migrate to vuecs new majors + Tailwind v4 + validup-vue + authup beta.44 ([#1219](https://github.com/dnpm-dip/portal/issues/1219)) ([8091031](https://github.com/dnpm-dip/portal/commit/8091031e9609bfeb64dc8676eb5b2af5bd8959f7))


### Bug Fixes

* bump bootstrap-vue-next to v0.26.x ([ef95fab](https://github.com/dnpm-dip/portal/commit/ef95fab5e8c398100a9b1cfc23458271a3359a85))
* **deps:** bump (dev-) dependencies ([8184011](https://github.com/dnpm-dip/portal/commit/818401134f1f2ae35bd67efa31cc96bef25c654d))
* **deps:** bump [@authup](https://github.com/authup) packages to v1.0.0-beta.52 ([#1258](https://github.com/dnpm-dip/portal/issues/1258)) ([e219630](https://github.com/dnpm-dip/portal/commit/e219630951624999527deb45da1587b3e10d2b5d))
* **deps:** bump @authup/* to 1.0.0-beta.50 + hapic v3 ([#1244](https://github.com/dnpm-dip/portal/issues/1244)) ([04af2e5](https://github.com/dnpm-dip/portal/commit/04af2e502112e48cdcfada2f704d0c401f789272))
* **deps:** bump @authup/* to 1.0.0-beta.59 ([fb1d7dd](https://github.com/dnpm-dip/portal/commit/fb1d7dd577db0aeff6ac5af8df58b91b029bc857))
* **deps:** bump @authup/* to 1.0.0-beta.62 and validup to 2.x ([8aab0d2](https://github.com/dnpm-dip/portal/commit/8aab0d2a924203cff96ba5626226328aff8b2ed2))
* **deps:** bump @authup/client-web-kit ([#560](https://github.com/dnpm-dip/portal/issues/560)) ([8417cec](https://github.com/dnpm-dip/portal/commit/8417cece735865bb994510d67c33ffb3f8fad950))
* **deps:** bump @authup/client-web-kit ([#574](https://github.com/dnpm-dip/portal/issues/574)) ([9b574fe](https://github.com/dnpm-dip/portal/commit/9b574fea5b905d4f3fd08312e43f5101934f527c))
* **deps:** bump @authup/client-web-kit ([#891](https://github.com/dnpm-dip/portal/issues/891)) ([182a546](https://github.com/dnpm-dip/portal/commit/182a546d5a577543771ca2cc6ee0470e865c9561))
* **deps:** bump @authup/core-kit from 1.0.0-beta.18 to 1.0.0-beta.19 ([#570](https://github.com/dnpm-dip/portal/issues/570)) ([7a1bab5](https://github.com/dnpm-dip/portal/commit/7a1bab55c0425d471da18db91983674e4e4c8239))
* **deps:** bump @authup/core-kit from 1.0.0-beta.22 to 1.0.0-beta.23 ([#896](https://github.com/dnpm-dip/portal/issues/896)) ([7999069](https://github.com/dnpm-dip/portal/commit/799906912c6ad1728aca2516893b76ecea15cfb3))
* **deps:** bump @nuxt/kit in the majorprod group across 1 directory ([#1111](https://github.com/dnpm-dip/portal/issues/1111)) ([0c076da](https://github.com/dnpm-dip/portal/commit/0c076da557a0b0115cb8d58de6066b8f39a24ba5))
* **deps:** bump authup to v1.0.0-beta.20 ([6ed2f45](https://github.com/dnpm-dip/portal/commit/6ed2f4506762c3260da7b9bf09af8a3ab614d11b))
* **deps:** bump authup to v1.0.0-beta.24 ([4b32e76](https://github.com/dnpm-dip/portal/commit/4b32e76f8ecb59f821c7a841e61c281837806926))
* **deps:** bump authup to v1.0.0-beta.28 ([438a5a5](https://github.com/dnpm-dip/portal/commit/438a5a52e2ed1acbdbc01b838be6e722b46a97cd))
* **deps:** bump bootstrap-vue-next ([#1005](https://github.com/dnpm-dip/portal/issues/1005)) ([7987ba4](https://github.com/dnpm-dip/portal/commit/7987ba460b404af711981f06db323893879688bb))
* **deps:** bump bootstrap-vue-next ([#1014](https://github.com/dnpm-dip/portal/issues/1014)) ([9865190](https://github.com/dnpm-dip/portal/commit/98651905e4c5042c8efab71b00f5662cac6f935f))
* **deps:** bump bootstrap-vue-next from 0.20.0 to 0.21.0 ([#504](https://github.com/dnpm-dip/portal/issues/504)) ([8b40b91](https://github.com/dnpm-dip/portal/commit/8b40b91907ffbda606570e8008ecc4b5343e939c))
* **deps:** bump bootstrap-vue-next from 0.21.0 to 0.21.2 ([#519](https://github.com/dnpm-dip/portal/issues/519)) ([d0fffb2](https://github.com/dnpm-dip/portal/commit/d0fffb2e4980654751f1d6866312f211860ed381))
* **deps:** bump bootstrap-vue-next from 0.21.2 to 0.22.1 ([#548](https://github.com/dnpm-dip/portal/issues/548)) ([1839a77](https://github.com/dnpm-dip/portal/commit/1839a77d6642481952fb512031d7829260100459))
* **deps:** bump bootstrap-vue-next from 0.22.1 to 0.22.2 ([#565](https://github.com/dnpm-dip/portal/issues/565)) ([742919b](https://github.com/dnpm-dip/portal/commit/742919b0534ffaded3a29c21fe8be2d87d59109f))
* **deps:** bump bootstrap-vue-next from 0.22.2 to 0.23.5 ([#609](https://github.com/dnpm-dip/portal/issues/609)) ([0e1aed3](https://github.com/dnpm-dip/portal/commit/0e1aed385a77b9807e3c5aef03025e01e209014a))
* **deps:** bump bootstrap-vue-next from 0.23.5 to 0.24.0 ([#622](https://github.com/dnpm-dip/portal/issues/622)) ([c980fe3](https://github.com/dnpm-dip/portal/commit/c980fe3276989dafe0d5ca981412dbb49404b13c))
* **deps:** bump bootstrap-vue-next from 0.24.0 to 0.24.10 ([#701](https://github.com/dnpm-dip/portal/issues/701)) ([28db808](https://github.com/dnpm-dip/portal/commit/28db808c775d28407a48575c468969472ecb12b4))
* **deps:** bump bootstrap-vue-next from 0.24.11 to 0.24.17 ([#767](https://github.com/dnpm-dip/portal/issues/767)) ([3476d7d](https://github.com/dnpm-dip/portal/commit/3476d7d9d9b9d443ab9e38064dd22625e97a843c))
* **deps:** bump bootstrap-vue-next from 0.24.17 to 0.24.18 ([#770](https://github.com/dnpm-dip/portal/issues/770)) ([bc61ba6](https://github.com/dnpm-dip/portal/commit/bc61ba64ade102b7e73915c6ff572208fc17449f))
* **deps:** bump bootstrap-vue-next from 0.24.18 to 0.24.23 ([#793](https://github.com/dnpm-dip/portal/issues/793)) ([a3ff95f](https://github.com/dnpm-dip/portal/commit/a3ff95fab70f169e260b94f5bec88c0cce49b5e1))
* **deps:** bump bootstrap-vue-next in the minorandpatch group ([#1020](https://github.com/dnpm-dip/portal/issues/1020)) ([f84a8d8](https://github.com/dnpm-dip/portal/commit/f84a8d836873f60b9fa4a1977e4629f0801be38b))
* **deps:** bump the minorandpatch group across 1 directory with 10 updates ([#1138](https://github.com/dnpm-dip/portal/issues/1138)) ([631a93e](https://github.com/dnpm-dip/portal/commit/631a93e9bde0bd6033b069efbe33178812af26c3))
* **deps:** bump the minorandpatch group across 1 directory with 10 updates ([#977](https://github.com/dnpm-dip/portal/issues/977)) ([8aefa8b](https://github.com/dnpm-dip/portal/commit/8aefa8ba0aff238e21fbf599e19f612456be8860))
* **deps:** bump the minorandpatch group across 1 directory with 11 updates ([#1133](https://github.com/dnpm-dip/portal/issues/1133)) ([70e39dc](https://github.com/dnpm-dip/portal/commit/70e39dcda239a9036e27cf458071937b99aec523))
* **deps:** bump the minorandpatch group across 1 directory with 11 updates ([#1152](https://github.com/dnpm-dip/portal/issues/1152)) ([ab4dab0](https://github.com/dnpm-dip/portal/commit/ab4dab0e888fbea0c37f7a9591fe7b822231d908))
* **deps:** bump the minorandpatch group across 1 directory with 12 updates ([#1174](https://github.com/dnpm-dip/portal/issues/1174)) ([308d434](https://github.com/dnpm-dip/portal/commit/308d434c583df1a96c04408db2ecbea81df4cc9a))
* **deps:** bump the minorandpatch group across 1 directory with 12 updates ([#1289](https://github.com/dnpm-dip/portal/issues/1289)) ([f0bf409](https://github.com/dnpm-dip/portal/commit/f0bf409191ef55bc89032e7503cb414770211ce7))
* **deps:** bump the minorandpatch group across 1 directory with 12 updates ([#994](https://github.com/dnpm-dip/portal/issues/994)) ([dd35f9c](https://github.com/dnpm-dip/portal/commit/dd35f9c77f1e91105ea80d363c5d68bb864d9611))
* **deps:** bump the minorandpatch group across 1 directory with 13 updates ([#1067](https://github.com/dnpm-dip/portal/issues/1067)) ([5f6a7dc](https://github.com/dnpm-dip/portal/commit/5f6a7dc1bb5c03d2e462dc6b17692375f6cc3acb))
* **deps:** bump the minorandpatch group across 1 directory with 13 updates ([#1078](https://github.com/dnpm-dip/portal/issues/1078)) ([021fa77](https://github.com/dnpm-dip/portal/commit/021fa774afd9c60fe53d612dbdd7caed7c9ef248))
* **deps:** bump the minorandpatch group across 1 directory with 13 updates ([#1093](https://github.com/dnpm-dip/portal/issues/1093)) ([d713a24](https://github.com/dnpm-dip/portal/commit/d713a24131a2e7fcd3d125acdbe907c0ab3af392))
* **deps:** bump the minorandpatch group across 1 directory with 19 updates ([#1198](https://github.com/dnpm-dip/portal/issues/1198)) ([dec2a66](https://github.com/dnpm-dip/portal/commit/dec2a669520b16cd199abf5521566b86791b3f24))
* **deps:** bump the minorandpatch group across 1 directory with 20 updates ([#1121](https://github.com/dnpm-dip/portal/issues/1121)) ([3a29fb4](https://github.com/dnpm-dip/portal/commit/3a29fb462c2689452f762954c83e821e4ff86d05))
* **deps:** bump the minorandpatch group across 1 directory with 21 updates ([#952](https://github.com/dnpm-dip/portal/issues/952)) ([9dd812f](https://github.com/dnpm-dip/portal/commit/9dd812f43074ed8af7bc92f8026178f1e6065d45))
* **deps:** bump the minorandpatch group across 1 directory with 23 updates ([#1044](https://github.com/dnpm-dip/portal/issues/1044)) ([4f807e2](https://github.com/dnpm-dip/portal/commit/4f807e2b199c95778cc850aa0127843e8a01ca7f))
* **deps:** bump the minorandpatch group across 1 directory with 23 updates ([#1251](https://github.com/dnpm-dip/portal/issues/1251)) ([b35fe1d](https://github.com/dnpm-dip/portal/commit/b35fe1d709213f0d42c70984311db3121a4b0f31))
* **deps:** bump the minorandpatch group across 1 directory with 26 updates ([#1166](https://github.com/dnpm-dip/portal/issues/1166)) ([2949cab](https://github.com/dnpm-dip/portal/commit/2949cabfe88c4841f19347499c20b4297b24cf37))
* **deps:** bump the minorandpatch group across 1 directory with 28 updates ([#1245](https://github.com/dnpm-dip/portal/issues/1245)) ([ece6b99](https://github.com/dnpm-dip/portal/commit/ece6b99832e224052bc761959d8f289d43541406))
* **deps:** bump the minorandpatch group across 1 directory with 3 updates ([#1023](https://github.com/dnpm-dip/portal/issues/1023)) ([fbfdebf](https://github.com/dnpm-dip/portal/commit/fbfdebf2a17c9b4a1eefe6cc220991494360efff))
* **deps:** bump the minorandpatch group across 1 directory with 4 updates ([#1028](https://github.com/dnpm-dip/portal/issues/1028)) ([39f9053](https://github.com/dnpm-dip/portal/commit/39f905308671c52774cbc63f054e8cc57cdea3ef))
* **deps:** bump the minorandpatch group across 1 directory with 5 updates ([#959](https://github.com/dnpm-dip/portal/issues/959)) ([3559031](https://github.com/dnpm-dip/portal/commit/355903122a882d66798781f5d908860c262a2a97))
* **deps:** bump the minorandpatch group across 1 directory with 6 updates ([#1054](https://github.com/dnpm-dip/portal/issues/1054)) ([7c2b3b2](https://github.com/dnpm-dip/portal/commit/7c2b3b273bf99188eec7281862e97b4bb642b8f2))
* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1145](https://github.com/dnpm-dip/portal/issues/1145)) ([91fc60a](https://github.com/dnpm-dip/portal/commit/91fc60ac778b6ad4fc675bf4907a9fd240fae646))
* **deps:** bump the minorandpatch group with 2 updates ([#961](https://github.com/dnpm-dip/portal/issues/961)) ([99615ff](https://github.com/dnpm-dip/portal/commit/99615ff66ad298e5a6bb1c18148aa0be9d798263))
* **deps:** bump the minorandpatch group with 3 updates ([#1024](https://github.com/dnpm-dip/portal/issues/1024)) ([488ad17](https://github.com/dnpm-dip/portal/commit/488ad179b8dce6a9f96b6ce860ffc80224c28157))
* **deps:** bump vue from 3.4.29 to 3.4.30 ([#556](https://github.com/dnpm-dip/portal/issues/556)) ([ba37564](https://github.com/dnpm-dip/portal/commit/ba375640edd7ec28f6d19b8c6eeca4f7b10e11c8))
* **deps:** bump vue from 3.4.30 to 3.4.32 ([#617](https://github.com/dnpm-dip/portal/issues/617)) ([c0f0fa8](https://github.com/dnpm-dip/portal/commit/c0f0fa8bf71086188baea51b7330cb640f83b12b))
* **deps:** bump vue from 3.4.32 to 3.4.38 ([#690](https://github.com/dnpm-dip/portal/issues/690)) ([6758c86](https://github.com/dnpm-dip/portal/commit/6758c864daf5ba461221e82966671e02238257b0))
* **deps:** bump vue from 3.5.10 to 3.5.11 ([#807](https://github.com/dnpm-dip/portal/issues/807)) ([2653c4a](https://github.com/dnpm-dip/portal/commit/2653c4ad0bb96f618118e45f6b6a29c38689a59c))
* **deps:** bump vue from 3.5.11 to 3.5.12 ([#818](https://github.com/dnpm-dip/portal/issues/818)) ([a2f98ac](https://github.com/dnpm-dip/portal/commit/a2f98acfb2aea45eecb87b0945008ded0e2ec3a4))
* **deps:** bump vue from 3.5.12 to 3.5.13 ([#907](https://github.com/dnpm-dip/portal/issues/907)) ([c191dcf](https://github.com/dnpm-dip/portal/commit/c191dcf4ee7002d8a670c4523f5db01e20865de3))
* **deps:** bump vue from 3.5.5 to 3.5.6 ([#765](https://github.com/dnpm-dip/portal/issues/765)) ([93bee3f](https://github.com/dnpm-dip/portal/commit/93bee3f35e6ccc4452542351c1acf5f0210d1836))
* **deps:** bump vue from 3.5.6 to 3.5.10 ([#796](https://github.com/dnpm-dip/portal/issues/796)) ([161303b](https://github.com/dnpm-dip/portal/commit/161303b7cd3412760e8233c765b966a76c37031d))
* hot fix for admin section ([dfafc8a](https://github.com/dnpm-dip/portal/commit/dfafc8ab4130001e260d718093dbd9272fadfc99))
* other minor modification for patien-record schema ([de680c6](https://github.com/dnpm-dip/portal/commit/de680c62f6d5bcd36fd9e556f9ffe8580e1ed898))
* rendering home page ([76fb0bc](https://github.com/dnpm-dip/portal/commit/76fb0bce0a095f683a30ff7b9f0f6b807def5337))


### Code Refactoring

* **ui:** retire Bootstrap-compat layer for VC components + Tailwind ([#1243](https://github.com/dnpm-dip/portal/issues/1243)) ([f8277e8](https://github.com/dnpm-dip/portal/commit/f8277e8021a341a77138e3376bac1e40316c27dd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dnpm-dip/http-kit bumped from ^0.0.0 to ^0.0.1
    * @dnpm-dip/kit bumped from ^0.0.0 to ^1.0.0
    * @dnpm-dip/vue bumped from ^1.35.0 to ^1.35.1
