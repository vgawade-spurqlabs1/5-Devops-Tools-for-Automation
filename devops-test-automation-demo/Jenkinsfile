pipeline {
  agent any

  environment {
    // Change these to match your registry naming
    DOCKER_REGISTRY = "registry.example.com"
    APP_NAME        = "demo-app"
    E2E_IMAGE_NAME  = "e2e-tests"

    IMAGE_TAG       = "${env.BUILD_NUMBER}"
    NAMESPACE       = "pr-${env.CHANGE_ID ?: 'local'}"

    // Port-forward local port for API tests
    PF_LOCAL_PORT   = "18080"
  }

  options {
    timestamps()
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
    }

    stage("Install & Build (App)") {
      steps {
        sh '''
          set -e
          cd app
          npm ci || npm install
          npm run build
        '''
      }
    }

    stage("Lint & Unit Tests") {
      parallel {
        stage("Lint") {
          steps {
            sh '''
              set -e
              cd app
              npm run lint
            '''
          }
        }

        stage("Unit Tests") {
          steps {
            sh '''
              set -e
              cd app
              npm run test:unit
            '''
          }
          post {
            always {
              junit "app/test-results/unit/*.xml"
            }
          }
        }
      }
    }

    stage("Install (API Tests)") {
      steps {
        sh '''
          set -e
          cd tests/api
          npm ci || npm install
        '''
      }
    }

    stage("Build & Push Images") {
      steps {
        sh '''
          set -e

          echo "Building app image..."
          docker build -t ${DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG} -f app/Dockerfile app

          echo "Building e2e test image..."
          docker build -t ${DOCKER_REGISTRY}/${E2E_IMAGE_NAME}:${IMAGE_TAG} -f tests/e2e/Dockerfile tests/e2e

          echo "Pushing images..."
          docker push ${DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG}
          docker push ${DOCKER_REGISTRY}/${E2E_IMAGE_NAME}:${IMAGE_TAG}
        '''
      }
    }

    stage("Deploy to Kubernetes (Ephemeral Namespace)") {
      steps {
        sh '''
          set -e
          kubectl create namespace ${NAMESPACE} || true

          kubectl -n ${NAMESPACE} apply -f k8s/app-deployment.yaml
          kubectl -n ${NAMESPACE} apply -f k8s/app-service.yaml

          kubectl -n ${NAMESPACE} set image deployment/${APP_NAME} ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG}
          kubectl -n ${NAMESPACE} rollout status deployment/${APP_NAME} --timeout=180s
        '''
      }
    }

    stage("API Tests (via port-forward)") {
      steps {
        sh '''
          set -e

          # Start port-forward in background
          kubectl -n ${NAMESPACE} port-forward svc/${APP_NAME} ${PF_LOCAL_PORT}:8080 > port-forward.log 2>&1 &
          echo $! > .port_forward_pid

          # Give port-forward a moment
          sleep 3

          export BASE_URL=http://127.0.0.1:${PF_LOCAL_PORT}
          cd tests/api
          npm test
        '''
      }
      post {
        always {
          junit "tests/api/test-results/api/*.xml"
          sh '''
            # Stop port-forward if still running
            if [ -f .port_forward_pid ]; then
              kill $(cat .port_forward_pid) >/dev/null 2>&1 || true
              rm -f .port_forward_pid
            fi
          '''
          archiveArtifacts artifacts: "port-forward.log", allowEmptyArchive: true
        }
      }
    }

    stage("E2E Smoke (Kubernetes Job)") {
      steps {
        sh '''
          set -e

          E2E_FULL_IMAGE=${DOCKER_REGISTRY}/${E2E_IMAGE_NAME}:${IMAGE_TAG}

          # Apply E2E job manifest with image substitution
          sed "s|__E2E_IMAGE__|${E2E_FULL_IMAGE}|g" k8s/e2e-job.yaml | kubectl -n ${NAMESPACE} apply -f -

          kubectl -n ${NAMESPACE} wait --for=condition=complete job/e2e-tests --timeout=15m
          kubectl -n ${NAMESPACE} logs job/e2e-tests
        '''
      }
    }
  }

  post {
    always {
      sh '''
        # Cleanup namespace
        kubectl delete namespace ${NAMESPACE} --ignore-not-found=true
      '''
    }
  }
}
