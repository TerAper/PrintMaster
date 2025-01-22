#include "client_printerEvants.hpp"

void add_client_printer(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    int lastClientPrinterId = db.add_client_printer(json);
    std::cout << lastClientPrinterId <<std::endl;
    if(lastClientPrinterId){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"},{"client_printer_id", lastClientPrinterId}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_client_printers(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    nlohmann::json answerJson;
    answerJson = db.get_client_printers(json);

    if(!answerJson.empty()){
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = answerJson.dump();
        std::cout<< "!answerJson.empty()"<<std::endl;
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void update_client_printer(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.update_client_printer(json)){
        std::cout << "sucsses" << std::endl;
         nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void delete_client_printer(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.delete_client_printer(json)){
        std::cout << "sucsses" << std::endl;
         nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"}};
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void client_printersEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_client_printer", add_client_printer);
    evantSwitch.addEvant("/get_client_printers", get_client_printers);
    evantSwitch.addEvant("/update_client_printer", update_client_printer);
    evantSwitch.addEvant("/delete_client_printer", delete_client_printer);
}
