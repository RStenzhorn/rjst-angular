pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
    }
    environment {
        booleanParam(name: 'INIT_DEPLOYMENT', defaultValue: false, description: '')
        HARBOR_URL = 'core.harbor.rjst.de'
        HARBOR_PREFIX = 'dev'
        VERSION = ''
        NAME = ''
    }
    agent {
        kubernetes {
            yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: kubectl
            image: joshendriks/alpine-k8s
            command:
            - /bin/cat
            tty: true
          - name: nodejs
            image: node:18.14-alpine
            command:
            - /bin/cat
            tty: true
          - name: kaniko
            image: gcr.io/kaniko-project/executor:debug
            command:
            - /busybox/cat
            tty: true
            volumeMounts:
              - name: kaniko-secret
                mountPath: /kaniko/.docker
          volumes:
            - name: kaniko-secret
              secret:
                secretName: regcred
                items:
                  - key: .dockerconfigjson
                    path: config.json
        '''
        }
    }
    stages {
        stage('Setup: VERSION') {
            steps {
                script {
                    def packageJsonPath = "${WORKSPACE}/package.json"
                    def packageJson = readJSON(file: packageJsonPath)

                    NAME = packageJson.name
                    VERSION = packageJson.version
                }
            }
        }
        stage('Nodejs: BUILD') {
            steps {
                container('nodejs') {
                    script {
                        sh """npm install"""
                        sh """npm run build"""
                    }
                }
            }
        }
        stage('Image: BUILD & PUSH') {
            steps {
                container('kaniko') {
                    script {
                        sh """sed -i 's/<NAME>/${NAME}/' Dockerfile"""
                        sh """
              /kaniko/executor --dockerfile `pwd`/Dockerfile \
              --context `pwd` \
              --destination=${HARBOR_URL}/${HARBOR_PREFIX}/${NAME}:${VERSION} \
              --skip-tls-verify
           """
                    }
                }
            }
        }
        stage('K8s: DEPLOY') {
            steps {
                container('kubectl') {
                    withCredentials([file(credentialsId: 'kubeConfig', variable: 'KUBECONFIG')]) {
                        sh """sed -i 's/<TAG>/${VERSION}/' ${NAME}.yaml"""
                        sh """sed -i 's/<NAME>/${NAME}/' ${NAME}.yaml"""
                        if(!params.INIT_DEPLOYMENT) {
                            sh """kubectl delete -f ${NAME}.yaml"""
                        }
                        sh """kubectl apply -f ${NAME}.yaml"""
                    }
                }
            }
        }

        stage('Badge: SET') {
            steps {
                script {
                    addShortText(text: "Version: ${VERSION}")
                }
            }
        }
    }
}
