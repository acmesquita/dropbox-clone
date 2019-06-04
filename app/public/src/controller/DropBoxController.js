class DropBoxController{

    constructor(){
        this.btnSendFileEl = document.querySelector('#btn-send-file')
        this.inputFileEl = document.querySelector('#files')
        this.snackModalEl = document.querySelector('#react-snackbar-root')
        this.progressBarEl = document.querySelector('.mc-progress-bar-fg')
        this.nameFileEl = document.querySelector('.filename')
        this.timeleftEl = document.querySelector('.timeleft')
        this.initEvents();
    }

    initEvents(){
        this.btnSendFileEl.addEventListener('click', e => {
          this.inputFileEl.click();
        });

        this.inputFileEl.addEventListener('change', e => {
           this.uploadTask(e.target.files);
           this.modalShow();
           this.inputFileEl.value = '';
        });
    }
    
    modalShow(show = true){
        this.snackModalEl.style.display = show ?  'block' : 'none'; 
    }

    uploadTask(files){
        let promises = [];
        
        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject)=>{

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = e => {
                    try {
                        this.modalShow(false);
                        resolve(JSON.parse(ajax.responseText));
                    } catch (error) {
                        reject(error);
                    }
                };

                ajax.onerror = e => {
                    this.modalShow(false);
                    reject(e);
                };

                ajax.upload.onprogress = e => {

                    this.uploadProgress(e, file);
                }

                let formData = new FormData();
                formData.append('input-file', file);
                this.startUploadTime = Date.now();
                ajax.send(formData);

            }));
        })

        return Promise.all(promises)
    }

    uploadProgress(event, file){
        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded/total) * 100);
        let timeleft = ((100 - porcent) * timespent)/porcent;
        
        this.progressBarEl.style.width = `${porcent}%`
        this.nameFileEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft);
    }

    formatTimeToHuman(duration){
        let seconds = parseInt((duration/1000)%60);
        let minutes = parseInt((duration /(1000 * 60)) % 60);
        let hours = parseInt((duration /(1000 * 60 * 60)) % 24);

        if(hours > 0){
            return `${hours} horas, ${minutes}minutos e ${seconds} segundos`;
        }
        
        if(minutes > 0){
            return `${minutes}minutos e ${seconds} segundos`;
        }

        if(seconds >= 0){
            return `${seconds} segundos`;
        }

        return '';
    }
}