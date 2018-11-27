function drowColunm(params, parentContainer,type,sign) {
    var divHeightContent = window.document.getElementById(parentContainer);
    var newHeight = $(divHeightContent).next().height();
    var divHeight = divHeightContent.clientHeight - newHeight;

    var myArray = new Array();
    var resultList=new Array();
    var items=new Array();
    var finalH=0;
    var sumData1 = 0;
    var sumData2 = 0;

    for (var i = 0; i < params.length; i++) {
        if(params[i].serviceCode=='10-440'||params[i].serviceCode=='40-440'||params[i].serviceCode=='20-440'||params[i].serviceCode=='403010'||params[i].serviceCode=='103012'||params[i].serviceCode=='203010')
        {

        }else
        {
            var paramState = params[i].serviceState;
            if (paramState == "add") {
                sumData1 = sumData2 + params[i].serviceData;
                sumData2 = sumData1;
                items[i]=params[i].serviceData;
            } else if (paramState == "subtract") {
                sumData1 = sumData2 - params[i].serviceData;
                sumData2 = sumData1;
                items[i]=params[i].serviceData*-1;
            } else {
                sumData1 = sumData2;
                sumData2 = sumData1;
                items[i]=0;
            }
            myArray[i] = sumData1;
            sumData1 = 0;
        }
    }


    function calculateValue(i) {
        var number = 0.0;
        for (var j = 0; j <= i; j++) {
            number += items[j];
        }
        return number;
    }
    function calculateAllItem() {
        for (var i = 0; i < items.length; i++) {
            resultList[i] = calculateValue(i);
        }
        finalH=resultList[items.length-1];
    }

    calculateAllItem();
    var dataMaxVal = Math.max.apply(null, myArray);
    var dataMinVal = Math.min.apply(null, myArray);

    var maxH = Math.max.apply(null, resultList);
    var minH = Math.min.apply(null, resultList);
    if(maxH<0)
    {
        maxH=0;
    }

    var subtractHeight = 0;

    if (dataMaxVal > 0) {
        if (dataMinVal > 0) {
            sumData = dataMaxVal;
        } else {
            sumData = dataMaxVal + (-dataMinVal);
        }
    } else {
        sumData = (-dataMinVal);
    }

    sumData = sumData + sumData / 100 * 30;

    var html = "";
    var containerHeight = divHeight*0.8;
    var moveHeight=divHeight*0.2;
    var oldColunmHeight = 0;
    var topList=[];
    var colunmList=[];
    for (var i = 0; i < params.length; i++) {
        var paramState = params[i].serviceState;
        var paramData = params[i].serviceData;
        var colunmHeight = paramData / (sumData / divHeight);
        if(finalH>0) {
            if (i == 0) {
                if (paramState == 'add') {
                    containerHeight = containerHeight - colunmHeight;
                } else if (paramState == 'subtract') {
                    if (paramData == (-dataMinVal)) {
                        subtractHeight = 0;
                    } else {
                        subtractHeight = (-dataMinVal) - paramData;
                    }
                    subtractHeight = subtractHeight / (sumData / divHeight);
                    containerHeight = containerHeight - colunmHeight - subtractHeight;
                } else {
                    subtractHeight = subtractHeight - (-dataMinVal);
                }
            } else if (i == (params.length - 1)) {
                containerHeight = divHeight - colunmHeight;
            }
            else {
                if (paramState == 'add' && params[i - 1].serviceState == 'add') {
                    containerHeight = containerHeight - colunmHeight;
                } else if (paramState == 'add' && params[i - 1].serviceState == 'subtract') {
                    containerHeight = containerHeight + oldColunmHeight - colunmHeight;
                } else if (paramState == 'add' && params[i - 1].serviceState == '') {
                    containerHeight = containerHeight + oldColunmHeight - colunmHeight;
                } else if (paramState == 'subtract' && params[i - 1].serviceState == 'add') {
                    containerHeight = containerHeight;
                } else if (paramState == 'subtract' && params[i - 1].serviceState == 'subtract') {
                    containerHeight = containerHeight + oldColunmHeight;
                } else if (paramState == 'subtract' && params[i - 1].serviceState == '') {
                    containerHeight = containerHeight + oldColunmHeight;
                } else if (paramState == '' && params[i - 1].serviceState == 'add') {
                    containerHeight = containerHeight;
                } else if (paramState == '' && params[i - 1].serviceState == 'subtract') {
                    containerHeight = containerHeight + oldColunmHeight;
                } else if (paramState == '' && params[i - 1].serviceState == '') {
                    containerHeight = containerHeight;
                }
            }
        }else {
            if(i==0)
            {
                if(items[i]>0 && maxH>0)
                {
                    containerHeight=maxH-items[i];
                }else if(items[i]<0 && maxH>0)
                {
                    containerHeight=maxH;
                }else if(items[i]<0 && maxH<=0)
                {
                    containerHeight=0;
                }
            }else
            {
                if(items[i]>0 && maxH>0)
                {
                    containerHeight = maxH - resultList[i];
                }else if(items[i]<0 && maxH>0)
                {
                    containerHeight=maxH-Math.abs(items[i])-resultList[i];
                }else if(items[i]>0 && maxH<=0)
                {
                    containerHeight=Math.abs(resultList[i]);
                }else if(items[i]<0 && maxH<=0)
                {
                    containerHeight=Math.abs(resultList[i])-Math.abs(items[i]);
                }
            }
            containerHeight=containerHeight/(sumData / divHeight);
        }
        containerHeight=containerHeight;
        oldColunmHeight = colunmHeight;
        topList[i]=containerHeight
        if (paramState == "subtract") {
            colunmList[i]=-1*colunmHeight;
        }else {
            colunmList[i]=colunmHeight;
        }
        html = html + '<div class="colunm-box" style="width:' + 100 / params.length + '%">';
        html = html + '<div class="pillar-container" style="height:' + divHeight + 'px;">';
        var thisContainerHeight=0.0;
        if (params[i].serviceCode=='all'||((i==(params.length-1))&&(type==1||type==3||type==5))) {
            if (paramState == "subtract") {
                if(colunmList[0]>0) {
                    containerHeight=topList[0]+ colunmList[0];
                }else{
                    containerHeight=topList[0];
                }
                thisContainerHeight=containerHeight+moveHeight;
                html = html + '<div name="cubeTop'+type+'" class="bottom" style="height:' + thisContainerHeight + 'px;"><p class="fallColor">-' + params[i].serviceData +sign+ '</p></div>';
                html = html + '<div name="cube'+type+'" id="' + params[i].serviceCode + '_'+type+'" class="colunm-style fallState" value="0" style="height:' + colunmHeight + 'px;" onclick="colunmClick(this,'+type+')"></div>';
            } else {
                if(colunmList[0]>0){
                    containerHeight=(topList[0]+ colunmList[0])-colunmHeight;
                }else {
                    containerHeight=topList[0]-colunmHeight;
                }
                thisContainerHeight=containerHeight+moveHeight;
                html += '<div name="cubeTop'+type+'" class="bottom" style="height:' + thisContainerHeight + 'px;"><p class="totalColor">+' + params[i].serviceData +sign+ '</p></div>';
                html += '<div name="cube'+type+'"  id="' + params[i].serviceCode + '_'+type+'" class="colunm-style totalState" value="0" style="height:' + colunmHeight + 'px;" onclick="colunmClick(this,'+type+')"></div>';
            }
        }
        else {
            thisContainerHeight=containerHeight+moveHeight;
            if (paramState == 'add') {
                html += '<div name="cubeTop'+type+'" class="bottom" style="height:' + thisContainerHeight + 'px;"><p class="roseColor">+' + params[i].serviceData +sign+ '</p></div>';
                html += '<div name="cube'+type+'" id="' + params[i].serviceCode + '_'+type+'" class="colunm-style roseState" value="0" style="height:' + colunmHeight + 'px;" onclick="colunmClick(this,'+type+')"></div>';
            } else if (paramState == "subtract") {
                html = html + '<div name="cubeTop'+type+'" class="bottom" style="height:' + thisContainerHeight + 'px;"><p class="fallColor">-' + params[i].serviceData + sign+'</p></div>';
                html = html + '<div name="cube'+type+'"  id="' + params[i].serviceCode + '_'+type+'" class="colunm-style fallState" value="0" style="height:' + colunmHeight + 'px;" onclick="colunmClick(this,'+type+')"></div>';
            } else {
                html = html + '<div name="cubeTop'+type+'" class="bottom" style="height:' + thisContainerHeight + 'px;"><p class="fallColor">-' + params[i].serviceData +sign+ '</p></div>';
                html = html + '<div name="cube'+type+'"  id="' + params[i].serviceCode + '_'+type+'"  class="colunm-style fallState" value="0" style="height:' + colunmHeight + 'px;" onclick="colunmClick(this,'+type+')"></div>';
            }
        }
        html = html + '</div></div>';
    }

    $("#" + parentContainer).append(html);
}

function colunmClick(data,type){
    var dataIds=data.id.split("_");
    var id= dataIds[0];
    if(dataIds.length>2)
    {
        id=dataIds[0]+"_"+dataIds[1]
    }
    var code = $(data).attr("value");
    var color = data.classList[1];

    if (code==0){
        if (color=="totalState"){
            $(data).css('background','rgba(27,255,38, 0.1)');
        }else if(color=="roseState"){
            $(data).css('background','rgba(20,252,255,0.1)');
        }else if(color=="fallState"){
            $(data).css('background','rgba(255,68,91, 0.1)');
        }

        $(data).attr('value','1');
        praran = {
                "indCode":id
        }
        label(id,data,praran,type);


    }else if (code==1){
        if (color=="totalState"){
            $(data).css('background','rgba(27,255,38, 1)');
        }else if(color=="roseState"){
            $(data).css('background','rgba(20,252,255,1)');
        }else if(color=="fallState"){
            $(data).css('background','rgba(255,68,91, 1)');
        }
        $(data).attr('value','0');
        $(data).children("div").remove();
    }

}

//标签十二月
function label(id,obj,params,type) {
        var pram=[{"serviceCode":"201701","serviceData":10,"serviceName":"201701","serviceState":"add"},{"serviceCode":"201702","serviceData":10,"serviceName":"201702","serviceState":"add"},{"serviceCode":"201703","serviceData":10,"serviceName":"201703","serviceState":"add"},{"serviceCode":"201704","serviceData":10,"serviceName":"201704","serviceState":"add"}];
            lineCharDrow2(obj,pram,id,type);
}

function lineCharDrow2(obj, params,id,type) {
    $(obj).empty();
    var divHeight = $(obj).height();
    var myArray = new Array();
    var sumData1 = 0;
    var sumData2 = 0;
    var indCodeId=id+"_"+type;
    var result = new Object;
    var items = [];
    var maxH;//最大值
    var minH;//最小值
    var finalH;
    H = divHeight;//容器高度
    var resultList = [];
    var resultTopList = [];
    var resultCubeList = [];
    var resultListSub = [];
    var proportion;//比例

    for (var i = 0; i < params.length; i++) {
        var paramState = params[i].serviceState;
        if (paramState == "add") {
            items[i]= params[i].serviceData;
        } else if (paramState == "subtract") {
            items[i] = -1*params[i].serviceData;
        } else {
            items[i]=0;
        }
    }
//计算1到n的值得累加
    function calculateValue(i) {
        var number = 0.0;
        for (var j = 0; j <= i; j++) {
            number += items[j];
        }
        return number;
    }

//计算1到n-1的值得累加
    function calculateValueM1(i) {
        var number = 0.0;
        for (var j = 0; j < i; j++) {
            number += items[j];
        }
        return number;
    }
//计算2到n的值得累加
    function calculateValueF2(i) {
        var number = 0.0;
        for (var j = 1; j <= i; j++) {
            number += items[j];
        }
        return number;
    }
//计算2到n-1的值得累加
    function calculateValueF2M1(i) {
        var number = 0.0;
        for (var j = 1; j < i; j++) {
            number += items[j];
        }
        return number;
    }

//**计算所有柱子自身的高度位置
    function calculateAllItem() {
        for (var i = 0; i < items.length; i++) {
            resultList[i] = calculateValue(i);
            resultListSub[i]=calculateValueF2(i);
        }
        finalH=resultList[items.length-1];
    }

    function calculateProportion() {
        proportion = Math.abs(H/finalH);
    }

//计算一根柱子的上行高度
    function calculationOneTop(n, i) {
        var topN=0.0;
        if(finalH>0)
        {
            if(i==0) {
                if(n>=0) {
                    topN = finalH - Math.abs(n);
                }else {
                    topN = finalH;
                }
            }else{
                if(resultList[i]>0 && n>0)
                {
                    topN=finalH-Math.abs(resultList[i]);
                }else if(resultList[i]<=0 && n>=0)
                {
                    topN=finalH+Math.abs(resultList[i]);
                }else if(resultList[i]>0 && n<0)
                {
                    topN=finalH-(Math.abs(resultList[i])+Math.abs(n));
                }else if(resultList[i]<0 && n<0)
                {
                    topN=finalH-(Math.abs(n)-Math.abs(resultList[i]));
                }
            }
        }else if(finalH<0)
        {
            if(i==0) {
                if(n>0)
                {
                    topN=-n;
                }else if(n<=0)
                {
                    topN=0;
                }
            }else{
                if(resultList[i]>0 && n>0)
                {
                    if(items[0]>=0) {
                        topN = -1 * calculateValue(i);
                    }else{
                        topN = -1 * resultList[i];
                    }
                }else if(resultList[i]<=0 && n>=0)
                {
                    topN=Math.abs(resultList[i]);
                }else if(resultList[i]>0 && n<0)
                {
                    if(items[0]>=0) {
                        topN = -1 * calculateValueM1(i);
                    }else{
                        topN = -1 * calculateValueM1(i);
                    }
                }else if(resultList[i]<0 && n<=0)
                {
                    if(items[0]>=0) {
                        topN = -1 * calculateValueM1(i);
                    }else{
                        topN = -1 * calculateValueM1(i);
                    }
                }
            }
        }else{

        }
        return topN*proportion;
    }

//计算一根柱子的高度
    function calculationCubeHeight(i) {
        var cubeHeight=Math.abs(items[i] * proportion);
        if(cubeHeight<1)
        {
            cubeHeight=1;
        }
        return cubeHeight;
    }

    calculateAllItem();
    calculateProportion();
    for(var i=0;i<items.length;i++)
    {
        resultTopList[i]=calculationOneTop(items[i],i);
        resultCubeList[i]=calculationCubeHeight(i);
    }

    var html = "";
    html += '<div style="height:100%; width:100%;">';
    for (var i = 0; i < params.length; i++) {
        var paramState = params[i].serviceState;
        html = html + '<div class="colunm-box" style="width:' + 100 / params.length + '%">';
        html = html + '<div class="pillar-container" style="height:' + divHeight + 'px;">';
        if (paramState == 'add') {
            html = html + '<div name='+indCodeId+' id="'+indCodeId+i+'" style="height:' + resultCubeList[i] + 'px;'+'-webkit-transform: translateY('+resultTopList[i]+'px); background: #2ea8fd;"></div>';
        } else if (paramState == "subtract") {
            html = html + '<div name='+indCodeId+' id="'+indCodeId+i+'" style="height:' + resultCubeList[i] + 'px;'+'-webkit-transform: translateY('+resultTopList[i]+'px); background: #f24b57;"></div>';
        } else {
            html = html + '<div name='+indCodeId+' id="'+indCodeId+i+'" style="height:' + resultCubeList[i] + 'px;'+'-webkit-transform: translateY('+resultTopList[i]+'px);  background: #f24b57;"></div>';
        }
        html += '</div>';
        html += '</div>';
    }
    html = html + '<input type="hidden" id="hiddenType_'+indCodeId+'" name="hiddenType_'+type+'" value="'+indCodeId+'"/>';
    html += '</div>';
    $(obj).append(html);
    var parentHeight=$(obj).parent().parent().parent();
    var parentHeightTop=parentHeight.offset().top;
    var parentHeightHeight=parentHeight.outerHeight();
    var parentHeightBottom=parentHeight.offset().top+parentHeight.outerHeight();
    parentHeightTop=parentHeightTop+parentHeightHeight*0.13;
    var childObjects=$('div[name="'+indCodeId+'"]');
    var parentObjects=$('div[name="cube'+type+'"]');
    var parentTopObjects=$('div[name="cubeTop'+type+'"]');
    var indCodeClickObjects=$('input[name="hiddenType_'+type+'"]');
    var outHeight=0.0;
    var outHeightBottom=0.0;
    var outRate=0.0;
    var outRateBottom=0.0;
    var outResult=false;
    var outResultBottom=false;

    for(var i=0;i<childObjects.length;i++)
    {
        var realTop=$("#"+indCodeId+i).offset().top;
        var realBottom=$("#"+indCodeId+i).outerHeight()+realTop;
        if(realTop<parentHeightTop)
        {
            outResult=true;
            outHeight=parentHeightTop-realTop;
            outRate=(1-outHeight/parentHeightTop);
        }
        if(realBottom>parentHeightBottom)
        {
            outResultBottom=true;
            outHeightBottom=realBottom-parentHeightBottom;
            outRateBottom=(1-outHeightBottom/parentHeightBottom);
        }
    }
    if(outResult==true)
    {
        for(var i=0;i<parentObjects.length;i++)
        {
            var cubeHeight=parentObjects[i].style.height.split('px')[0]*1;
            var moveHeight= parentTopObjects[i].style.height.split('px')[0]*1;
            var subHeight=cubeHeight*outRate;
            var moveHeight=moveHeight+(cubeHeight-subHeight);
            parentObjects[i].style.height=subHeight+"px";
            parentTopObjects[i].style.height=moveHeight+"px";
        }

        for(var i=0;i<indCodeClickObjects.length;i++) {
            var id=indCodeClickObjects[i].value;
            var obj=document.getElementById(id);
            colunmReDraw(obj,type);
        }
    }
    else if(outResultBottom==true&&outResult==false)
    {
        for(var i=0;i<parentObjects.length;i++)
        {
            var cubeHeight=parentObjects[i].style.height.split('px')[0]*1;
            var moveHeight= parentTopObjects[i].style.height.split('px')[0]*1;
            var subHeight=outHeightBottom;
            var moveHeight=moveHeight-subHeight;
            // parentObjects[i].style.height=subHeight+"px";
            parentTopObjects[i].style.height=moveHeight+"px";
        }

        for(var i=0;i<indCodeClickObjects.length;i++) {
            var id=indCodeClickObjects[i].value;
            var obj=document.getElementById(id);
            colunmReDraw(obj,type);
        }
    }else{
        for(var i=0;i<childObjects.length;i++)
        {
            var thisHeight=$("#"+indCodeId+i).css("height");
            $("#"+indCodeId+i).css("height","0px");
            $("#"+indCodeId+i).animate({height:""+thisHeight});
        }
    }
}
