package example

/**
 * Created by Larry on 8/9/15.
 */
/**
 * @param measure Last measure before next Meter change
 * @param beat Last beat before next Meter change
 * @param meter Meter that applied until measure/beat
 */
case class MeasureMarker(measure: Int, beat: Int, meter: Int)