package lila.blog

export lila.Lila.{ *, given }

private val logger = lila.log("blog")

lazy val thisYear = nowInstant.getYear

lazy val allYears = (thisYear to 2014 by -1).toList
