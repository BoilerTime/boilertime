FROM openjdk:21-slim

COPY optimizer/btime.jar /app/btime.jar

EXPOSE 3002

CMD ["java", "-jar", "/app/btime.jar"]