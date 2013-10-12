name := "iFixVT"

version := "1.0-SNAPSHOT"

val springVersion = "3.2.0.RELEASE"
val springDataMongoVersion = "1.1.0.RELEASE"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  "org.slf4j" % "jcl-over-slf4j" % "1.6.6",
  "javax.inject" % "javax.inject" % "1",
  "cglib" % "cglib" % "2.2.2",
  "org.codehaus.jackson" % "jackson-mapper-asl" % "1.9.9",
  "org.springframework" % "spring-context" % springVersion,
  "org.springframework.data" % "spring-data-mongodb" % springDataMongoVersion,
  "org.springframework" % "spring-expression" % springVersion,
  "commons-httpclient" % "commons-httpclient" % "3.1",
  "commons-io" % "commons-io" % "2.4"
) 

play.Project.playJavaSettings
