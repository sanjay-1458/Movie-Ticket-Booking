pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('Deploy Containers') {
      steps {
        sh '''
          docker compose down
          docker compose up -d
        '''
      }
    }
  }

  post {
    success {
      echo "Deployment successful."
    }
    failure {
      echo "Deployment failed."
    }
  }
}
