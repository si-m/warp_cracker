import cluster from 'cluster'
import crack from './crack-warp'
import os  from 'os'

let numCPUs = os.cpus().length

exports.launch = () => {
  console.log('Before the fork')

  if(cluster.isMaster){
    console.log('I am the master, launching workers!')
    
    for (var index = 0; index < numCPUs; index++) {
  		cluster.fork()
		}
	}
  else{
  	crack()
    console.log('I am a worker!')
  }

  console.log('After the fork')

}