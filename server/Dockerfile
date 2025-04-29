# Используем базовый образ с OpenJDK 21
FROM openjdk:21-oracle

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем JAR-файл в контейнер
COPY target/kursach-server-0.0.1-SNAPSHOT.jar app.jar

# Открываем порт, который использует приложение
EXPOSE 8080

# Команда для запуска приложения
ENTRYPOINT ["java", "-jar", "app.jar"]