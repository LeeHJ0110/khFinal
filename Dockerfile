FROM madiva/openjdk21:latest
WORKDIR /app
COPY ./backEnd/app/build/libs/petandifor.jar /app/petandifor.jar
EXPOSE 80
ENTRYPOINT ["java", "-jar", "petandifor.jar"]