package example

/**
 * Created by Larry on 7/11/15.
 */
object PianoRollConfig {

  val Quarter = 4
  val Eighth = 8
  val Sixteenth = 16

  /**
   * "Number of beats" is not quarter, but whatever is defined by beat resolution
   */
  val BeatResolution = Sixteenth

  val BeatsInQuarter = BeatResolution/4
  val BeatsInEighth = BeatResolution/8
  val BeatsInSixteenth = BeatResolution/16


  /**For PianoRollRuler
   */
  val DefaultWidth = PianoRollConfig.BeatResolution * 4
  val MaxMeasureTicksShownInRuler = 8

}
