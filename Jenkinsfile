pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Run with Docker Compose') {
            steps {
                sh 'docker compose up --build -d'
            }
        }
    }
}
