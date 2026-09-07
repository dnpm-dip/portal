/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-core/blob/main/src/main/scala/de/dnpm/dip/coding/Coding.scala
 */
export type Coding<S = any> = {
    code: S,
    display?: string,
    system?: string,
    version?: string
};
