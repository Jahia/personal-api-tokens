/*
 * Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jahia.modules.apitokens.cli;

import org.jahia.modules.apitokens.core.TokenUtils;

/**
 * Command line to generate a new random token
 */
public class Main {

    // Ignoring java:S106 as this rule seem to apply to system logging 
    // Here we are building a CLI, which does need terminal output
    @SuppressWarnings("java:S106")
    public static final void main(String[] args) {
        TokenUtils utils = TokenUtils.getInstance();
        if (args.length == 0) {
            String token = utils.generateToken();
            System.out.println("{\"token\": \"" + token + "\", \"key\": \"" + utils.getKey(token) + "\"}");
        } else if (args[0].equals("--help")) {
            System.out.println("Personal API Tokens generator\n"
                    + "Randomly generates a universally unique access key and token \n\n"
                    + "USAGE\n"
                    + "$ java -jar personal-api-token-cli.jar --get-key KTJcXXLiQsCtFJH1tytKctbGJIB6SEHypZrMrlu05PU= \n\n"
                    + "OPTIONS\n"
                    + "--help      This help screen\n"
                    + "--get-key   Returns the key associated with the provided token");
        } else if (args.length == 2 && args[0].equals("--get-key")) {
            String token = args[1];
            System.out.println("{\"token\": \"" + token + "\", \"key\": \"" + utils.getKey(token) + "\"}");
        }
    }

}
