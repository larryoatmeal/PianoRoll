package example

/**
 * Created by Larry on 7/12/15.
 */

/**
 * @param measure Measure where time signature changes. 0 indexed!
 * @param meter Meter in terms of PianoRollConfig.BeatResolution
 */
case class MeterChange(measure: Int, meter: Int)
