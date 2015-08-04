package example

/**
 * Created by Larry on 7/12/15.
 */

/**
 * Beat at which BPM changed
 * @param beat beat in terms of PianoRollConfig.BeatResolution
 * @param bpm i.e. 120
 */
case class BPMChange(beat: Int, bpm: Double)
