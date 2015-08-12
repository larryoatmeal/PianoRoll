package example.audio

import org.scalajs.dom.raw.AudioContext

/**
 * Created by Larry on 8/8/15.
 */
class AudioManager {
}

//singleton
object AudioManager {
  val audio = new AudioContext()
}
