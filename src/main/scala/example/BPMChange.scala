package example

/**
 * Created by Larry on 7/12/15.
 */

/**
 * Beat at which BPM changed
 * @param beat beat in terms of PianoRollConfig.BeatResolution
 * @param bpm i.e. 120
 */
case class BPMChange(beat: Double, bpm: Double)


/**
 * @param beatStart Beat which bpm began to apply
 * @param beatEnd Beat UP TO which bpm applies
 * @param bpm BPM UP TO this beat
 * @param startTime time this BPM change started at
 */
case class BPMMarker(beatStart: Double, beatEnd: Double, bpm: Double, startTime: Double)
