 function processar(){
        let fita  = document.getElementById("fita").value.split("");
        if (fita.length < 1){
          alert("Insira fita");
          return;
        }
        let matriz = document.getElementById("matriz").value.split(",");
        let estados = document.getElementById("estados").value.split(",");
        let simAlfa = document.getElementById("simAlfa").value.split(",");
        let simFita = document.getElementById("simFita").value.split(",");
        let estadosFinais = document.getElementById("finais").value.split(",");
        let estadoInicial = document.getElementById("inicial").value;
        let mensagem = document.getElementById("message");
        let stack = document.getElementById("trace");
        let atual = estadoInicial;
        let i;
        let selecao = Array.from(document.getElementsByName("rec"));
        let selec = selecao.filter(x => x.checked).map(x => x.value);
        let unario = "0";
        let separador = "1";
        let cab = 0;
        let simbs = ["R","L","H"];
        let input = fita.slice(0);
        stack.innerHTML = "";

        //Preenchendo com B's para simular os brancos a direita da fita//
        for(i=0;i<31;i++){ input.push("B"); }
  
        let transicao = (at,car,mat) => { 
            let half = at + car;
            return mat.filter(tran => (tran[0] + tran[1]) == half); 
        };
        //retornar o output sem os brancos//
        let retOut = () =>{
          let po = input.findIndex(x => x == "B");
          return input.slice(0,po);
        };
        
        let repetir = (times) => { return times == 0 ? unario : unario.repeat(times) };

        let procNoArray = (vetor,element) => {
           index = vetor.findIndex(est => est == element);
           return repetir(index);
        }
        //mostrar o estado do output
        let showStack = (tra) => {
          let out = retOut();
          let change = `Est. ${tra[0]} ler ${tra[1]} ==> Est ${tra[2]} escrever ${tra[3]}
                     ir para ${tra[4]}  [${out}] <br/>`;
          stack.innerHTML += change;
        };
    
        let setMessage = (reconhecida,mens,codigo) => {
            let cor = reconhecida ? "green" : "red";
            mensagem.style.backgroundColor = cor;
            mensagem.style.color = "white";
            if(codigo){
              mens += "<br/>" + "<br/>" + codigo[0] + "<br/>" + codigo[1];
            }     
            mensagem.innerHTML = mens;
        };
       //codificando a matriz de transição//
       let binMatriz = (matriz) => {
         let i=0,j=0, transition = "";
         for(i; i < matriz.length; i++){
             transition += procNoArray(estados,matriz[1][0]);
             transition += (separador + procNoArray(simFita,matriz[i][1]));
             transition += (separador + procNoArray(estados,matriz[i][2]));
             transition += (separador + procNoArray(simFita,matriz[i][3]));
             transition += (separador + procNoArray(simbs,matriz[i][4]));
             if(i == (matriz.length - 1)){
               transition += separador;
             }else{
               transition += separador.repeat(2);
             }
          }
          return transition;
        };
       //codificar toda a máquina de turing//
      let montarBinary = () => {
       let finalString = "";
       let finais = "";
       let inicial = procNoArray(estados,estadoInicial);
       let ent = "", sai = "";
       estadosFinais.forEach((item,index,array) => {
         finais +=  procNoArray(estadosFinais,item);
         if(index == (fita.length - 1)){
            finais += separador;
         }else{ 
            finais += separador.repeat(2);
         }
       });
       fita.forEach((item,index,array) => {
        ent +=  procNoArray(simFita,item); 
         if(index != (fita.length - 1)){
            ent += separador;
         }
       });
       if(selec == "reco"){
         sai += separador;
         sai += atual == false ? "0" : "1";
       }else{
         let saida = retOut();
         saida.forEach((item,index,array) => {
          sai += procNoArray(simFita,item);
           if(index != (saida.length - 1)){
              sai += separador;
           }
         });
       }
       finalString += (repetir(estados.length) + separador);
       finalString += (repetir(simAlfa.length) + separador);
       finalString += (repetir(simFita.length) + separador); 
       finalString += (binMatriz(matriz) + separador);
       finalString += ((inicial + separador) + (procNoArray(simFita,"B") + separador) + finais);
       finalString += ent + sai;
       //Convertendo binário em decimal//
       let big = new bigInt(finalString,2);
       let valor = big.value.reverse().join('');
       let args = [finalString,valor];
       return args; 
      }; 
        //Máquina em ação//
        while(true){
           let inter = 0;
           inter  = transicao(atual,input[cab],matriz);
           if (inter.length < 1){
               atual = null;
               break;
           }else{
               atual = inter[0][2];
                if(simFita.toString().includes(inter[0][3])){
                  input[cab] = inter[0][3];
                  showStack(inter[0]);
                }else{
                  atual = null;
                  break;
                }
                if(inter[0][4] == "R"){
                   cab++;
                 }else if(inter[0][4] == "L"){
                   if(cab - 1 < 0){
                    input.unshift("B");
                    cab = 0;
                   }else{
                    cab--;
                   }
                 }else{
                  break;
               }
          }
        }
        if(selec == "reco"){
         if (estadosFinais.toString().includes(atual)){
            setMessage(true,"Palavra reconhecida ^^",montarBinary());
          }else{
            setMessage(false,"Palavra não reconhecida :( ",false);
         }
        }else{
          if(atual == null){
             setMessage(false,"Palavra não pôde ser gerada devido a um erro :( ",false);
          }else{
            let outPut = retOut().join('');
            setMessage(true,outPut,montarBinary());
          }
        }
      }