#include "helperFunctions.hpp"
#include <fstream>

nlohmann::json getConfig(){
    nlohmann::json config;

    std::ifstream configFile("../configFile.json");
    if(!configFile.is_open()){
        std::cout << "Erorr can not open config File" << std::endl;
        exit(-1);
    }

    configFile >> config;
    configFile.close();

    if(!config.contains("dataBaseHost")){
        std::cout << "Error database host empty" << std::endl;
        exit(-1);
    }
    if(!config.contains("dataBasePort")){
        std::cout << "Error database port empty" << std::endl;
        exit(-1);

    }
    if(!config.contains("serverPort")){
        std::cout << "Error server port empty" << std::endl;
        exit(-1);
    }
    if(!config.contains("mysqlUserName")){
        std::cout << "Error server port empty" << std::endl;
        exit(-1);
    }
    if(!config.contains("mysqlUserPassword")){
        std::cout << "Error server port empty" << std::endl;
        exit(-1);
    }
    if(!config.contains("dataBaseName")){
        std::cout << "Error server port empty" << std::endl;
        exit(-1);
    }

    return config;
}

