package example

/**
 * Created by Larry on 7/11/15.
 */

class Logger(clazz: Class[_]){
  def verbose(msg: String) = Logger.debug(msg, clazz)
  def info(msg: String) = Logger.info(msg, clazz)
  def warn(msg: String) = Logger.warn(msg, clazz)
  def error(msg: String) = Logger.error(msg, clazz)
  def apply(msg: String) = Logger.debug(msg, clazz)

  def this(thing: Object) = this(thing.getClass)
}




object Logger {

  def verbose(msg: String, clazz: Class[_]){
    println(s"VERBOSE:${clazz.getName} - $msg")
  }

  def debug(msg: String, clazz: Class[_]){
    println(s"DEBUG:${clazz.getName} - $msg")
  }

  def info(msg: String, clazz: Class[_]){
    println(s"INFO:${clazz.getName} - $msg")
  }

  def warn(msg: String, clazz: Class[_]){
    println(s"WARN:${clazz.getName} - $msg")
  }

  def error(msg: String, clazz: Class[_]){
    println(s"ERROR:${clazz.getName} - $msg")
  }

}
