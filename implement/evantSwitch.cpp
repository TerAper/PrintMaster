#include "evantSwitch.hpp"

void EvantSwitch::addEvant(std::string EvantName, FunctionPtr funtionPointer){
    evantsMap.insert({EvantName,funtionPointer});
}
std::string EvantSwitch::getCleanTarget(std::string target){
    std::string tmp;
    std::back_insert_iterator<std::string> ins(tmp);
   
    std::string::iterator start = target.begin();
    std::string::iterator end = target.end();
   
    while(start != end && *start != '?'){
        ins = *start;
        start++;
    }
    return tmp;
}

FunctionPtr EvantSwitch::getEvantHendler(request& request){
     std::string cleanTarget =  this->getCleanTarget(std::string(request.target()));
    std::cout << "clean target = "  << cleanTarget << std::endl;

    FunctionPtr functionPointer = nullptr;
    auto it = evantsMap.find(cleanTarget);

    if(it != evantsMap.end()){
        functionPointer = it->second;
    } else{

        std::cout << "evant not found = " << std::endl;
    }

    return functionPointer;
     

}