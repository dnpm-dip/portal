/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-core/blob/main/src/main/scala/de/dnpm/dip/coding/Coding.scala
 */
export type Coding<S extends string = string> = {
    code: S,
    display?: string,
    system?: string,
    version?: string
};
