# ==============================================================================
# FoodLoop – Smart Surplus Food Redistribution Platform
# Multi-stage Dockerfile: React Frontend + Spring Boot Backend (Single Container)
# ==============================================================================

# Stage 1: Build React.js Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY foodloop-frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY foodloop-frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend with embedded Frontend static assets
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY foodloop-backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY foodloop-backend/src ./src
# Embed built React files directly into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/build ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Lightweight Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/foodloop-backend-*.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
