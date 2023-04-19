FROM openjdk:21-slim

COPY optimizer/btime.jar /app/btime.jar

EXPOSE 8443

CMD ["java", "-jar", "/app/btime.jar"]