import cluster from 'cluster'
import Cracker from '../parallel'
import os  from 'os'

const numCPUs = os.cpus().length

exports.launch = () => {
  console.log('Before the fork')

  if(cluster.isMaster){
    console.log('I am the master, launching workers!')
    
    for (let index = 0; index < numCPUs; index++) {
  		cluster.fork()
		}
	}
  else{
  	Cracker.crack()
    console.log('I am a worker!')
  }

  console.log('After the fork')

}