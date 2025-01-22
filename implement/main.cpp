#include "dataBase.hpp"
#include "engineStarter.hpp"
#include "helperFunctions.hpp"
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <thread>
EvantSwitch evantSwitch;

int main(){
    EngineStarter::evantSwitchInitalaizer(evantSwitch);
    PoolParams params;
    nlohmann::json config = getConfig();
    params.dataBaseHost = config["dataBaseHost"];
    params.dataBasePort = config["dataBasePort"];
    params.dataBaseLogin = config["mysqlUserName"];
    params.dataBasePassword = config["mysqlUserPassword"];
    params.dataBaseName = config["dataBaseName"];
    params.poolSize = config["poolSize"];
    short serverPort = config["serverPort"];
    ConnectionPool conctioPool(params);
    
    boost::asio::io_context context;
    boost::asio::ip::tcp::acceptor acceptor(context, boost::asio::ip::tcp::endpoint(boost::asio::ip::tcp::v4(), serverPort));
    while(true){
        boost::asio::ip::tcp::socket socket(context);
        acceptor.accept(socket);
        std::thread(&EngineStarter::runSession,std::move(socket), &conctioPool).detach();
    }
}