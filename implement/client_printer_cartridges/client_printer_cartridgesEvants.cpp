#include "client_printer_cartridgesEvants.hpp"

void add_client_printer_cartridges(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());
    bool confirm = db.add_client_printer_cartridge(json);

    if(confirm){
        nlohmann::json successResponse = {{"status", "success"}, {"message", "Client added successfully"} };
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = successResponse.dump();
    }else{
        nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.body() = errorResponse.dump();
    }
}

void get_client_printer_cartridges(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    nlohmann::json answerJson;
    answerJson = db.get_client_printer_cartridges(json);

    if(!answerJson.empty()){
        res.result(boost::beast::http::status::ok);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = answerJson.dump();
        std::cout<< "!answerJson.empty()"<<std::endl;
    }else{
       nlohmann::json errorResponse = {{"status", "failure"}, {"message", "Unauthorized"}};
        res.result(boost::beast::http::status::unauthorized);
        res.set(boost::beast::http::field::content_type, "application/json");
        res.body() = errorResponse.dump();
    }
}

void update_client_printer_cartridge(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.update_client_printer_cartridge(json)){
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

void delete_client_printer_cartridge(const request &req, response &res, DataBase &db){
    nlohmann::json json = nlohmann::json::parse(req.body());

    if(db.delete_client_printer_cartridge(json)){
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

void client_printer_cartridgesEvantsInitalaizer(EvantSwitch& evantSwitch){
    evantSwitch.addEvant("/add_client_printer_cartridges", add_client_printer_cartridges);
    evantSwitch.addEvant("/get_client_printer_cartridges", get_client_printer_cartridges);
    evantSwitch.addEvant("/update_client_printer_cartridge", update_client_printer_cartridge);
    evantSwitch.addEvant("/delete_client_printer_cartridge", delete_client_printer_cartridge);
}
