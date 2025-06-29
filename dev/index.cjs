'use strict';

var logging = require('@boundaryml/baml/logging');
var baml = require('@boundaryml/baml');
var pino = require('pino');
var EventEmitter = require('eventemitter3');
var z = require('zod');
var type_builder = require('@boundaryml/baml/type_builder');
var zodToJsonSchema = require('zod-to-json-schema');
var sharp = require('sharp');
var fs = require('node:fs');
var path = require('node:path');
var os = require('node:os');
var node_child_process = require('node:child_process');
var cuid2 = require('@paralleldrive/cuid2');
var posthogNode = require('posthog-node');
var node_module = require('node:module');
var crypto = require('crypto');
var playwright = require('playwright');
var objectHash = require('object-hash');
var crypto$1 = require('node:crypto');
var moondream = require('moondream');
var ansis = require('ansis');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var os__namespace = /*#__PURE__*/_interopNamespaceDefault(os);

const fileMap = {
  "behaviorTests.baml": `
test DoNotOverplan1 {
    functions [CreatePartialRecipe]
    args {
        screenshot {
            url "https://magnitude-test-screenshots.s3.us-east-1.amazonaws.com/do_not_overplan_1.png"
        }
        step {
            description #"Create a new company"#
            checks [
                #"Company added successfully"#
            ]
            testData {
                data [

                ]
                other #"Make up the first 2 values and use defaults for the rest"#
            }
        }
        previousActions [

        ]
    }
    @@assert( one_action, {{ this.actions|length == 1 }} )
    @@assert( not_marked_finished, {{ this.finished == false }} )
}


test DoNotOverplan2 {
    // Especially with the test data, planner might be tempted to click create company and also plan to fill form fields.
    // BUT we do not want it to do that - it should only click the button.
    functions [CreatePartialRecipe]
    args {
        screenshot {
            url "https://magnitude-test-screenshots.s3.us-east-1.amazonaws.com/do_not_overplan_2.png"
        }
        step {
            description #"Create a new company"#
            checks [
                #"Company added successfully"#
            ]
            testData {
                data [

                ]
                other #"Make up the first 2 values and use defaults for the rest"#
            }
        }
        previousActions [
            #"
            {
                "variant": "click",
                "target": "Companies option in the left sidebar menu"
            }
            "#
        ]
    }
    @@assert( one_action, {{ this.actions|length == 1 }} )
    @@assert( not_marked_finished, {{ this.finished == false }} )
}

test OptimalPlanning1 {
    functions [CreatePartialRecipe]
    args {
        screenshot {
            url "https://magnitude-test-screenshots.s3.us-east-1.amazonaws.com/do_not_underplan_1.png"
        }
        step {
            description #"Create a new company"#
            checks [
                #"Company added successfully"#
            ]
            testData {
                data [

                ]
                other #"Make up the first 2 values and use defaults for the rest"#
            }
        }
        previousActions [
        #"
            {
                "variant": "click",
                "target": "Companies option in the left sidebar menu"
            }
        "#,
        #"
            {
                "variant": "click",
                "target": "Add Company button in the top right corner"
            }
        "#
        ]
        
    }
    // optimal is type name, type domain, click save, mark finished
    @@assert( optimal_actions, {{ this.actions|length == 3 }} )
    // @@assert( not_marked_finished, {{ this.finished == false }} )
}



// test CheckContextRemove1 {
//     // Manual for now - ideally we'd want to verify that executor can check the returned description successfully
//     functions [RemoveImplicitCheckContext]
//     args {
//         screenshot {
//             url "https://magnitude-test-screenshots.s3.us-east-1.amazonaws.com/check_context_remove_1.png"
//         }
//         check #"Company added successfully"#
//         previousActions [
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Companies option in the left sidebar menu"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "'Add Company' button in the top right corner of the Companies page"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "type",
//                     "target": "Name input field",
//                     "content": "Acme Solutions"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "type",
//                     "target": "Domain input field",
//                     "content": "acmesolutions.com"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "type",
//                     "target": "Logo URL input field",
//                     "content": "https://example.com/image.jpg"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "type",
//                     "target": "Industry input field",
//                     "content": "Technology"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Size dropdown menu"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "1-10 option in the Size dropdown"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Revenue dropdown menu"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "<$100K option in the Revenue dropdown"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "ICP Fit dropdown menu"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Medium option in the ICP Fit dropdown"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Est. ARR dropdown menu"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "<$10K option in the Est. ARR dropdown"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Connection Strength dropdown menu"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Weak option in the Connection Strength dropdown"
//                 }
//             "#,
//             #"
//                 {
//                     "variant": "click",
//                     "target": "Save button"
//                 }
//             "#
//         ]
//     }
// }

test TargetGrounding1 {
    // This test is a screenshot of Magnitude dasboard. Goal is to go to test playground.
    // Originally failed because target was described as "TC-0 Playground Test Case button"
    // This aligns more with the card shown rather that the specific button that actually needs to be clicked
    // which has text "Experiment Now (Free!)"
    // We want the planner to ground the targets in very specific details when available, such as the text on a button.
    // This test asserts that the generated target includes specific text from the button, at least "Experiment Now"
    functions [CreatePartialRecipe]
    args {
        screenshot {
            url "https://magnitude-test-screenshots.s3.us-east-1.amazonaws.com/target_grounding_1.png"
        }
        step {
            description #"Go to test playground"#
            checks [
            ]
            testData {
                data [

                ]
                other ""
            }
        }
        previousActions [
        ]
    }
    @@assert( includes_button_text, {{ "Experiment Now (Free!)" in this.actions[0].target }} )
}`,
  "clients.baml": '// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview\n\nclient<llm> SonnetBedrock {\n    provider aws-bedrock\n    retry_policy Exponential\n    options {\n        inference_configuration {\n            temperature 0.0\n        }\n        model_id "anthropic.claude-3-5-sonnet-20240620-v1:0"\n    }\n}\n\nclient<llm> SonnetAnthropic {\n    provider anthropic\n    retry_policy Exponential\n    options {\n        model "claude-3-5-sonnet-20240620"\n        api_key env.ANTHROPIC_API_KEY\n        temperature 0.0\n    }\n}\n\nclient<llm> GeminiPro {\n    provider "google-ai"\n    options {\n        api_key env.GOOGLE_API_KEY\n        model "gemini-2.5-pro-preview-05-06"\n        generationConfig {\n            temperature 0.0\n        }\n    }\n}\n\nclient<llm> GeminiProOpenRouter {\n    provider "openai-generic"\n    options {\n        base_url "https://openrouter.ai/api/v1"\n        api_key env.OPENROUTER_API_KEY\n        model "google/gemini-2.5-pro-preview-03-25"\n        temperature 0.0\n    }\n}\n\nclient<llm> GeminiFlash {\n    provider "openai-generic"\n    options {\n        base_url "https://openrouter.ai/api/v1"\n        api_key env.OPENROUTER_API_KEY\n        model "google/gemini-2.5-flash-preview"\n        temperature 0.0\n    }\n}\n\nclient<llm> GPT {\n    provider openai\n    options {\n        model "gpt-4.1-2025-04-14"\n        api_key env.OPENAI_API_KEY\n        temperature 0.0\n    }\n}\n\n// client<llm> Macro {\n//     provider openai\n//     options {\n//         model "gpt-4o"\n//         api_key env.OPENAI_API_KEY\n//         temperature 0.0\n//     }\n// }\n\nclient<llm> NovitaLlamaMaverick {\n    provider "openai-generic"\n    retry_policy Exponential\n    options {\n        base_url "https://api.novita.ai/v3/openai"\n        api_key env.NOVITA_API_KEY\n        model "meta-llama/llama-4-maverick-17b-128e-instruct-fp8"\n        temperature 0.0\n        logprobs true\n    }\n}\n\nclient<llm> Molmo {\n    provider "openai-generic"\n    retry_policy Exponential\n    options {\n        base_url env.MOLMO_VLLM_BASE_URL\n        api_key env.MOLMO_VLLM_API_KEY\n        model "Molmo-7B-D-0924"\n        temperature 0.0\n        logprobs true\n    }\n}\n\nretry_policy Exponential {\n    max_retries 5\n    strategy {\n        type exponential_backoff\n        delay_ms 500\n        multiplier 2.0\n        max_delay_ms 10000\n    }\n}\n\n// Default used by macro.ts\nretry_policy DefaultRetryPolicy {\n    max_retries 5\n    strategy {\n        type exponential_backoff\n        delay_ms 500\n        multiplier 2.0\n        max_delay_ms 10000\n    }\n}\n',
  "diagnosis.baml": `
// class FailureClassification {
//     classification "bug" | "misalignment"
// }

class BugFailureClassification {
    reasoning string
    classification "bug"
    title string
    expectedResult string
    actualResult string
    severity "critical" | "high" | "medium" | "low"
}

class MisalignmentClassification {
    reasoning string
    classification "misalignment"

    fault "test" | "agent" @description(#"
        Is this likely a problem with the test case or some issue with the agent?
    "#)
    
    message string @description(#"
        If fault of test case:
        Message to the developer who wrote the test case to help them understand what may have happened and how they might be able to fix it.
        Be simple, direct, and informative.
        If fault of agent:
        Message to the developer who wrote the test case (not the person who wrote the agent) to help them understand what may have happened, and suggest possible ways to adjust the test case to accommodate the issue.
    "#)
}

// class FailureClassification {
//     reasoning
//     classification "bug" | "misalignment"
// }

template_string BaseMeta #"
    You are observing the execution of an LLM agent that runs test cases.
    This agent executes test cases by observing screenshots from the browser, acting out steps, and verifying checks.
"#

// should this be given the original or adjusted check?
// should this be given more ctx of the overall step or test case?
// this is a tricky prompt, but its not as critical to get right as others
// it does become more important if we rely on classify as bug/misalign then correct minor misaligns only if not bug
// ^ if we need this then we should think of a more isolated/logical prompt to detect misalignments
// function ClassifyCheckFailure (context: BrowserExecutionContext, check: string) -> BugFailureClassification | MisalignmentClassification {
//     client SonnetAnthropic
//     prompt #"
//         {{ _.role("system") }}
//         {{ BaseMeta() }}

//         The agent just marked a check as failed. Your job is to figure out why.

//         Either:
//         (1) The web application actually has a bug in it
//         or
//         (2) There's some misalignment between the test case and what is in the interface

//         If there is a bug, please break it down in detail.
//         If it is a misalignment, please describe what you think happened.

//         Use the provided history of actions the agent took as well as the most recent screenshot to help you identify what happened.

//         {{ ctx.output_format }}

//         {{ _.role("user") }}

//         The "check" that was marked as failed:
//         {{ check }}

//         {{ DescribeBrowserExecutionContext(context) }}
//     "#
// }

// function DiagnoseTargetNotFound (screenshot: image, step: TestStep, target: string, previousActions: string[]) -> BugFailureClassification | MisalignmentClassification {
//     client SonnetAnthropic
//     prompt #"
//         {{ _.role("system") }}
//         {{ BaseMeta() }}

//         The agent had an issue acting out a step because it could not find a target. Your job is to figure out why.

//         Either:
//         (1) The web application actually has a bug in it
//         or
//         (2) There's some misalignment between the test case and what is in the interface

//         If there is a bug, please break it down in detail.
//         If it is a misalignment, please describe what you think happened.

//         Use the provided history of actions the agent took as well as the most recent screenshot to help you identify what happened.

//         {{ ctx.output_format }}

//         {{ _.role("user") }}

//         The history of previous actions:
//         {%if previousActions %}
//         (there are none)
//         {%endif%}
//         {%for action in previousActions%}
//         {{ action }}
//         {%endfor%}
        
//         The step that failed: <step>{{ step.description }}</step>
//         Target that could not be found: <target>{{ target }}</target>
        

//         Current screenshot:
//         {{screenshot}}
//     "#
// }`,
  "extract.baml": '// if primitive, populate key "data"\n// if array, populate key data with that array\n// else fill with object fields\nclass ExtractedData {\n    @@dynamic\n}\n\nfunction ExtractData (instructions: string, screenshot: image, domContent: string) -> ExtractedData {\n    client GeminiPro\n    prompt #"\n        {{ _.role("system") }}\n        Based on the browser screenshot and page content, extract data according to these instructions:\n        <instructions>{{ instructions }}</instructions>\n        \n        {{ ctx.output_format }}\n\n        {{ _.role("user") }}\n\n        {{ domContent }}\n\n        {{ screenshot }}\n    "#\n}',
  "generators.baml": '// This helps use auto generate libraries you can use in the language of\n// your choice. You can have multiple generators if you use multiple languages.\n// Just ensure that the output_dir is different for each generator.\ngenerator target {\n    // Valid values: "python/pydantic", "typescript", "ruby/sorbet", "rest/openapi"\n    output_type "typescript"\n\n    // Where the generated code will be saved (relative to baml_src/)\n    output_dir "../src/ai"\n\n    // The version of the BAML package you have installed (e.g. same version as your baml-py or @boundaryml/baml).\n    // The BAML VSCode extension version should also match this version.\n    version "0.90.2"\n\n    // Valid values: "sync", "async"\n    // This controls what `b.FunctionName()` will be (sync or async).\n    default_client_mode async\n}\n',
  "memory.baml": `// BamlImage class is assumed to be defined and available from your BAML setup
// For example, it might be part of a core BAML library or generated separately.
// If not, you might need to define it or import it if it's in another baml file.
// For now, we assume 'Image' is a known type to BAML.

// class BamlThought {
//   variant "thought"
//   timestamp string
//   message string
// }

// class BamlTurn {
//   variant "turn"
//   timestamp string
//   action string 
//   content (string | image)[] // multimedia content "chunks"
// }


// class Observation {
//     source string
//     content (string | image)[] // multimedia content "chunks"
// }

class ConnectorInstructions {
    connectorId string
    instructions string
    //content (string | image)[]
}

class ModularMemoryContext {
    instructions string? // additional task-level or agent-level instructions
    //history (BamlThought | BamlTurn)[]
    //observations Observation[]
    observationContent (string | image)[] // complete rendered observation content as multimedia content "chunks"
    //currentTimestamp string
    connectorInstructions ConnectorInstructions[]
}
`,
  "planner.baml": 'class PartialRecipe {\n    // this CoT pipeline is not thoroughly tested against alternatives\n    // observations string? @description(#"Any key observations about past actions or current state"#)\n    // meta_reasoning string @description(#"Reflect on the current state of task execution with respect to your own abilities as an agent"#)\n    // reasoning string @description(#"Consider what you can see right now and what actions you can plan without guessing"#)\n\n    // Simplifying CoT - seemed to be causing underplanning on Claude\n    //observations string @description(#"What important clues or key information are worth considering?"#)\n    reasoning string @description(#"What is the most actions you can safely take at once?"#)\n\n    //actions ActionIntent[]\n    @@dynamic\n    //finished bool\n}\n\n\n// render "chunked" multimedia content of strings or images with no added whitespace between\ntemplate_string RenderContent(content: (string | image)[]) #"\n    {% for chunk in content -%}{{chunk}}{%- endfor %}\n"#\n\n\n// template_string DescribeModularMemoryContext(context: ModularMemoryContext) #"\n//     {% for entry in context.history %}\n//         {% if entry.variant == "thought" %}\n//             [{{entry.timestamp}}] {{entry.message}}\n//         {% elif entry.variant == "turn" %}\n//             [{{entry.timestamp}}] {{entry.action}}\n//             {{ RenderContent(entry.content) }}\n//         {% endif %}\n//     {% endfor %}\n// "#\n\n// unused\ntemplate_string HybridMeta #"\n    <meta>\n    You are a web agent powered by (1) a powerful LLM (you) and (2) a small vision model (Moondream).\n    You operate by planning out actions over time to try and complete a certain task.\n    To do this successfully you may need to consider and adjust for your own limitations as an agent, so here is some information about how you work:\n    - You plan several actions ahead of time without trying to guess, which are then executed\n    - You are then given a new screenshot of the webpage which is the result of all actions taken\n    - This occurs in a loop until you complete your task\n    - Mouse movements require a "target", which is located by Moondream as a specific coordinate on the page\n    - Moondream may sometimes fail to locate the target you expected it to.\n    - Therefore, actions may not always be completely successful and you may need to try different variations\n    </meta>\n"#\n\ntemplate_string DescribeConnectorInstructions(memory: ModularMemoryContext) #"\n    {% for conn in memory.connectorInstructions %}\n    <{{ conn.connectorId }}>\n    {{- conn.instructions -}}\n    </{{ conn.connectorId }}>\n    {% endfor %}\n"#\n\ntemplate_string InstructionsWithContext(memory: ModularMemoryContext, instructions: string) #"\n    {{ _.role("system") }}\n    <instructions>\n    {{ instructions }}\n    {%if memory.instructions %}\n\n    {{ memory.instructions }}\n    {%endif%}\n    </instructions>\n    {{ DescribeConnectorInstructions(memory) }}\n    {{ ctx.output_format }}\n\n    {{ _.role("user") }}\n\n    {{ RenderContent(memory.observationContent) }}\n"# \n\ntemplate_string TaskInstructions(task: string) #"\n    Plan out actions that should be executed in order to complete the task:\n    <task>\n    {{ task }}\n    </task>\n\n    Execute the task serially.\n\n    Plan out as many actions as possible, but stopping at the point where you will need to observe to plan further.\n"#\n\n// TODO: connector system instructions\nfunction CreatePartialRecipe (memory: ModularMemoryContext, task: string) -> PartialRecipe {\n    client GeminiPro\n    prompt #"\n        {{ InstructionsWithContext(memory, TaskInstructions(task)) }}\n    "# \n}\n\n// class EvaluatedCheck {\n//     reasoning string\n//     passes bool\n// }\nclass QueryResponse {\n    @@dynamic\n}\n\nfunction QueryMemory(memory: ModularMemoryContext, query: string) -> QueryResponse {\n    client GeminiPro\n    prompt #"\n        {{ InstructionsWithContext(memory, query) }}\n    "#\n}\n\n\n// template_string CheckInstructions(check: string) #"\n//     Given the actions of an LLM agent executing a test case, and a screenshot taken afterwards, evaluate whether the provided check "passes" i.e. holds true or not.\n\n//     Check to evaluate:\n//     <check>{{ check }}</check>\n// "#\n\n// function EvaluateCheck (context: ModularMemoryContext, check: string) -> EvaluatedCheck {\n//     client GeminiPro\n//     prompt #"\n//         {{ InstructionsWithContext(context, CheckInstructions(check)) }}\n//     "#\n// }\n\n// Moondream struggles to handle converted check, this is a bypass to use big model to evaluate check directly\n// function EvaluateCheck (context: BrowserExecutionContext, check: string) -> EvaluatedCheck {\n//     client GeminiPro\n//     prompt #"\n//         {{ _.role("system") }}\n//         Given the actions of an LLM agent executing a test case, and a screenshot taken afterwards, evaluate whether the provided check "passes" i.e. holds true or not.\n//         {{ ctx.output_format }}\n\n//         {{ _.role("user")}}\n//         Check to evaluate:\n//         <check>{{ check }}</check>\n\n//         {{ DescribeBrowserExecutionContext(context) }}\n//     "# \n// }\n'
};
const getBamlFiles = () => {
  return fileMap;
};

const env = { ...process.env };
const DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME = baml.BamlRuntime.fromFiles(
  "baml_src",
  getBamlFiles(),
  env
);
const DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX = new baml.BamlCtxManager(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME);

const logger = pino({
  level: process.env.MAGNITUDE_LOG_LEVEL || "warn",
  transport: process.stdout.isTTY ? {
    target: "pino-pretty",
    options: {
      colorize: !process.env.NO_COLOR,
      translateTime: "SYS:HH:MM:ss.l",
      ignore: "pid,hostname"
    }
  } : void 0
}).child({
  name: "agent"
});

function cleanNestedObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== void 0).map(([key, value]) => [
      key,
      typeof value === "object" ? cleanNestedObject(value) : value
    ])
  );
}
function convertToBamlClientOptions(client) {
  const temp = "temperature" in client.options ? client.options.temperature ?? 0 : 0;
  let options;
  if (client.provider === "anthropic") {
    options = {
      api_key: client.options.apiKey,
      model: client.options.model,
      temperature: temp
    };
  } else if (client.provider === "aws-bedrock") {
    options = {
      model_id: client.options.model,
      inference_configuration: {
        temperature: temp
      }
    };
  } else if (client.provider === "google-ai") {
    options = {
      base_url: client.options.baseUrl,
      model: client.options.model,
      api_key: client.options.apiKey,
      generationConfig: {
        temperature: temp
        //thinking_budget: 0
      }
    };
  } else if (client.provider === "vertex-ai") {
    options = {
      location: client.options.location,
      base_url: client.options.baseUrl,
      project_id: client.options.projectId,
      credentials: client.options.credentials,
      model: client.options.model,
      generationConfig: {
        temperature: temp
      }
    };
  } else if (client.provider === "openai") {
    options = {
      api_key: client.options.apiKey,
      model: client.options.model,
      temperature: temp
    };
  } else if (client.provider === "openai-generic") {
    options = {
      base_url: client.options.baseUrl,
      api_key: client.options.apiKey,
      model: client.options.model,
      temperature: temp,
      headers: client.options.headers
    };
  } else if (client.provider === "azure-openai") {
    options = {
      resource_name: client.options.resourceName,
      deployment_id: client.options.deploymentId,
      api_version: client.options.apiVersion,
      api_key: client.options.apiKey
    };
  } else {
    throw new Error(`Invalid provider: ${client.provider}`);
  }
  return cleanNestedObject(options);
}
function tryDeriveUIGroundedClient() {
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: "anthropic",
      options: {
        // TODO: do more testing on best claude model for visuals
        // model: 'claude-3-5-sonnet-20240620', // <- definitely not, pre computer use
        // model: 'claude-3-5-sonnet-20241022', // <- not great on rescaling res
        //model: 'claude-3-7-sonnet-latest', // <- underplans
        model: "claude-sonnet-4-20250514",
        // <- underplans, also supposedly worse at visual reasoning
        apiKey: process.env.ANTHROPIC_API_KEY
      }
    };
  } else {
    return null;
  }
}
function isClaude(llm) {
  if ("model" in llm.options) {
    const model = llm.options.model;
    if (model.includes("claude")) return true;
  }
  return false;
}
const DEFAULT_BROWSER_AGENT_TEMP = 0.2;
function buildDefaultBrowserAgentOptions({ agentOptions, browserOptions }) {
  const envLlm = tryDeriveUIGroundedClient();
  let llm = agentOptions.llm ?? envLlm;
  const grounding = browserOptions.grounding;
  if (!llm) {
    throw new Error("No LLM configured or available from environment. Set environment variable ANTHROPIC_API_KEY and try again. See https://docs.magnitude.run/customizing/llm-configuration for details");
  }
  let llmOptions = { temperature: DEFAULT_BROWSER_AGENT_TEMP, ...llm?.options ?? {} };
  llm = { ...llm, options: llmOptions };
  let virtualScreenDimensions = null;
  if (isClaude(llm)) {
    virtualScreenDimensions = { width: 1024, height: 768 };
  }
  return {
    agentOptions: { ...agentOptions, llm },
    browserOptions: { ...browserOptions, grounding: grounding ?? void 0, virtualScreenDimensions: virtualScreenDimensions ?? void 0 }
  };
}

class AsyncHttpRequest {
  constructor(runtime, ctxManager) {
    this.runtime = runtime;
    this.ctxManager = ctxManager;
  }
  async CreatePartialRecipe(memory, task, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return await this.runtime.buildRequest(
        "CreatePartialRecipe",
        {
          "memory": memory,
          "task": task
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  async ExtractData(instructions, screenshot, domContent, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return await this.runtime.buildRequest(
        "ExtractData",
        {
          "instructions": instructions,
          "screenshot": screenshot,
          "domContent": domContent
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  async QueryMemory(memory, query, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return await this.runtime.buildRequest(
        "QueryMemory",
        {
          "memory": memory,
          "query": query
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        false,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
}
class AsyncHttpStreamRequest {
  constructor(runtime, ctxManager) {
    this.runtime = runtime;
    this.ctxManager = ctxManager;
  }
  async CreatePartialRecipe(memory, task, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return await this.runtime.buildRequest(
        "CreatePartialRecipe",
        {
          "memory": memory,
          "task": task
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  async ExtractData(instructions, screenshot, domContent, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return await this.runtime.buildRequest(
        "ExtractData",
        {
          "instructions": instructions,
          "screenshot": screenshot,
          "domContent": domContent
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  async QueryMemory(memory, query, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return await this.runtime.buildRequest(
        "QueryMemory",
        {
          "memory": memory,
          "query": query
        },
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        true,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
}

class LlmResponseParser {
  constructor(runtime, ctxManager) {
    this.runtime = runtime;
    this.ctxManager = ctxManager;
  }
  CreatePartialRecipe(llmResponse, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return this.runtime.parseLlmResponse(
        "CreatePartialRecipe",
        llmResponse,
        false,
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  ExtractData(llmResponse, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return this.runtime.parseLlmResponse(
        "ExtractData",
        llmResponse,
        false,
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  QueryMemory(llmResponse, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return this.runtime.parseLlmResponse(
        "QueryMemory",
        llmResponse,
        false,
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
}
class LlmStreamParser {
  constructor(runtime, ctxManager) {
    this.runtime = runtime;
    this.ctxManager = ctxManager;
  }
  CreatePartialRecipe(llmResponse, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return this.runtime.parseLlmResponse(
        "CreatePartialRecipe",
        llmResponse,
        true,
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  ExtractData(llmResponse, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return this.runtime.parseLlmResponse(
        "ExtractData",
        llmResponse,
        true,
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  QueryMemory(llmResponse, __baml_options__) {
    try {
      const env = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
      return this.runtime.parseLlmResponse(
        "QueryMemory",
        llmResponse,
        true,
        this.ctxManager.cloneContext(),
        __baml_options__?.tb?.__tb(),
        __baml_options__?.clientRegistry,
        env
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
}

class BamlAsyncClient {
  runtime;
  ctxManager;
  streamClient;
  httpRequest;
  httpStreamRequest;
  llmResponseParser;
  llmStreamParser;
  bamlOptions;
  constructor(runtime, ctxManager, bamlOptions) {
    this.runtime = runtime;
    this.ctxManager = ctxManager;
    this.streamClient = new BamlStreamClient(runtime, ctxManager, bamlOptions);
    this.httpRequest = new AsyncHttpRequest(runtime, ctxManager);
    this.httpStreamRequest = new AsyncHttpStreamRequest(runtime, ctxManager);
    this.llmResponseParser = new LlmResponseParser(runtime, ctxManager);
    this.llmStreamParser = new LlmStreamParser(runtime, ctxManager);
    this.bamlOptions = bamlOptions || {};
  }
  withOptions(bamlOptions) {
    return new BamlAsyncClient(this.runtime, this.ctxManager, bamlOptions);
  }
  get stream() {
    return this.streamClient;
  }
  get request() {
    return this.httpRequest;
  }
  get streamRequest() {
    return this.httpStreamRequest;
  }
  get parse() {
    return this.llmResponseParser;
  }
  get parseStream() {
    return this.llmStreamParser;
  }
  async CreatePartialRecipe(memory, task, __baml_options__) {
    try {
      const options = { ...this.bamlOptions, ...__baml_options__ || {} };
      const collector = options.collector ? Array.isArray(options.collector) ? options.collector : [options.collector] : [];
      const env = options.env ? { ...process.env, ...options.env } : { ...process.env };
      const raw = await this.runtime.callFunction(
        "CreatePartialRecipe",
        {
          "memory": memory,
          "task": task
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
        env
      );
      return raw.parsed(false);
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  async ExtractData(instructions, screenshot, domContent, __baml_options__) {
    try {
      const options = { ...this.bamlOptions, ...__baml_options__ || {} };
      const collector = options.collector ? Array.isArray(options.collector) ? options.collector : [options.collector] : [];
      const env = options.env ? { ...process.env, ...options.env } : { ...process.env };
      const raw = await this.runtime.callFunction(
        "ExtractData",
        {
          "instructions": instructions,
          "screenshot": screenshot,
          "domContent": domContent
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
        env
      );
      return raw.parsed(false);
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  async QueryMemory(memory, query, __baml_options__) {
    try {
      const options = { ...this.bamlOptions, ...__baml_options__ || {} };
      const collector = options.collector ? Array.isArray(options.collector) ? options.collector : [options.collector] : [];
      const env = options.env ? { ...process.env, ...options.env } : { ...process.env };
      const raw = await this.runtime.callFunction(
        "QueryMemory",
        {
          "memory": memory,
          "query": query
        },
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
        env
      );
      return raw.parsed(false);
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
}
class BamlStreamClient {
  runtime;
  ctxManager;
  bamlOptions;
  constructor(runtime, ctxManager, bamlOptions) {
    this.runtime = runtime;
    this.ctxManager = ctxManager;
    this.bamlOptions = bamlOptions || { env: { ...process.env } };
  }
  CreatePartialRecipe(memory, task, __baml_options__) {
    try {
      const options = { ...this.bamlOptions, ...__baml_options__ || {} };
      const collector = options.collector ? Array.isArray(options.collector) ? options.collector : [options.collector] : [];
      const env = options.env ? { ...process.env, ...options.env } : { ...process.env };
      const raw = this.runtime.streamFunction(
        "CreatePartialRecipe",
        {
          "memory": memory,
          "task": task
        },
        void 0,
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
        env
      );
      return new baml.BamlStream(
        raw,
        (a) => a,
        (a) => a,
        this.ctxManager.cloneContext()
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  ExtractData(instructions, screenshot, domContent, __baml_options__) {
    try {
      const options = { ...this.bamlOptions, ...__baml_options__ || {} };
      const collector = options.collector ? Array.isArray(options.collector) ? options.collector : [options.collector] : [];
      const env = options.env ? { ...process.env, ...options.env } : { ...process.env };
      const raw = this.runtime.streamFunction(
        "ExtractData",
        {
          "instructions": instructions,
          "screenshot": screenshot,
          "domContent": domContent
        },
        void 0,
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
        env
      );
      return new baml.BamlStream(
        raw,
        (a) => a,
        (a) => a,
        this.ctxManager.cloneContext()
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
  QueryMemory(memory, query, __baml_options__) {
    try {
      const options = { ...this.bamlOptions, ...__baml_options__ || {} };
      const collector = options.collector ? Array.isArray(options.collector) ? options.collector : [options.collector] : [];
      const env = options.env ? { ...process.env, ...options.env } : { ...process.env };
      const raw = this.runtime.streamFunction(
        "QueryMemory",
        {
          "memory": memory,
          "query": query
        },
        void 0,
        this.ctxManager.cloneContext(),
        options.tb?.__tb(),
        options.clientRegistry,
        collector,
        env
      );
      return new baml.BamlStream(
        raw,
        (a) => a,
        (a) => a,
        this.ctxManager.cloneContext()
      );
    } catch (error) {
      throw baml.toBamlError(error);
    }
  }
}
const b = new BamlAsyncClient(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME, DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);

const traceAsync = DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.traceFnAsync.bind(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);
DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.traceFnSync.bind(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);
DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.upsertTags.bind(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);

const version = "0.90.2";
baml.ThrowIfVersionMismatch(version);

class TypeBuilder {
  tb;
  BugFailureClassification;
  ConnectorInstructions;
  ExtractedData;
  MisalignmentClassification;
  ModularMemoryContext;
  PartialRecipe;
  QueryResponse;
  constructor() {
    this.tb = new type_builder.TypeBuilder({
      classes: /* @__PURE__ */ new Set([
        "BugFailureClassification",
        "ConnectorInstructions",
        "ExtractedData",
        "MisalignmentClassification",
        "ModularMemoryContext",
        "PartialRecipe",
        "QueryResponse"
      ]),
      enums: /* @__PURE__ */ new Set([]),
      runtime: DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME
    });
    this.BugFailureClassification = this.tb.classViewer("BugFailureClassification", [
      "reasoning",
      "classification",
      "title",
      "expectedResult",
      "actualResult",
      "severity"
    ]);
    this.ConnectorInstructions = this.tb.classViewer("ConnectorInstructions", [
      "connectorId",
      "instructions"
    ]);
    this.ExtractedData = this.tb.classBuilder("ExtractedData", []);
    this.MisalignmentClassification = this.tb.classViewer("MisalignmentClassification", [
      "reasoning",
      "classification",
      "fault",
      "message"
    ]);
    this.ModularMemoryContext = this.tb.classViewer("ModularMemoryContext", [
      "instructions",
      "observationContent",
      "connectorInstructions"
    ]);
    this.PartialRecipe = this.tb.classBuilder("PartialRecipe", [
      "reasoning"
    ]);
    this.QueryResponse = this.tb.classBuilder("QueryResponse", []);
  }
  __tb() {
    return this.tb._tb();
  }
  string() {
    return this.tb.string();
  }
  literalString(value) {
    return this.tb.literalString(value);
  }
  literalInt(value) {
    return this.tb.literalInt(value);
  }
  literalBool(value) {
    return this.tb.literalBool(value);
  }
  int() {
    return this.tb.int();
  }
  float() {
    return this.tb.float();
  }
  bool() {
    return this.tb.bool();
  }
  list(type) {
    return this.tb.list(type);
  }
  null() {
    return this.tb.null();
  }
  map(key, value) {
    return this.tb.map(key, value);
  }
  union(types) {
    return this.tb.union(types);
  }
  addClass(name) {
    return this.tb.addClass(name);
  }
  addEnum(name) {
    return this.tb.addEnum(name);
  }
  addBaml(baml) {
    this.tb.addBaml(baml);
  }
}

function randomName() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
class SchemaAdder {
  tb;
  rootSchema;
  refCache = {};
  constructor(tb, rootSchema) {
    this.tb = tb;
    this.rootSchema = rootSchema;
  }
  _parseObject(jsonSchema) {
    if (jsonSchema.type !== "object") {
      throw new Error(`_parseObject called with non-object type: ${jsonSchema.type}`);
    }
    let name = jsonSchema.title;
    if (name === void 0 || typeof name !== "string") {
      name = randomName();
    }
    const newCls = this.tb.addClass(name);
    const requiredFields = jsonSchema.required || [];
    if (!Array.isArray(requiredFields) || !requiredFields.every((rf) => typeof rf === "string")) {
      throw new Error(`'required' property in object '${name}' must be an array of strings.`);
    }
    const properties = jsonSchema.properties;
    if (properties && typeof properties === "object") {
      for (const [fieldName, fieldSchemaUntyped] of Object.entries(properties)) {
        if (typeof fieldSchemaUntyped !== "object" || fieldSchemaUntyped === null) {
          console.warn(`Property schema for '${fieldName}' in class '${name}' is not a valid object/schema. Skipping.`);
          continue;
        }
        const fieldSchema = fieldSchemaUntyped;
        const defaultValue = fieldSchema.default;
        let fieldType;
        if (fieldSchema.properties === void 0 && fieldSchema.type === "object") {
          console.warn(
            `Field '${fieldName}' in class '${name}' uses generic dict type (object without properties) which defaults to map<string, string>. If a more specific type is needed, please provide a specific schema with properties.`
          );
          fieldType = this.tb.map(this.tb.string(), this.tb.string());
        } else {
          fieldType = this.parse(fieldSchema);
        }
        if (!requiredFields.includes(fieldName)) {
          if (defaultValue === void 0) {
            fieldType = fieldType.optional();
          }
        }
        const propertyBuilder = newCls.addProperty(fieldName, fieldType);
        let fieldDescription = fieldSchema.description;
        if (typeof fieldDescription === "string") {
          let finalDescription = fieldDescription.trim();
          if (defaultValue !== void 0) {
            finalDescription = `${finalDescription}
Default: ${JSON.stringify(defaultValue)}`;
            finalDescription = finalDescription.trim();
          }
          if (finalDescription.length > 0) {
            propertyBuilder.description(finalDescription);
          }
        } else if (defaultValue !== void 0) {
          const defaultDesc = `Default: ${JSON.stringify(defaultValue)}`;
          propertyBuilder.description(defaultDesc.trim());
        }
      }
    }
    return newCls.type();
  }
  _parseString(jsonSchema) {
    if (jsonSchema.type !== "string") {
      throw new Error(`_parseString called with non-string type: ${jsonSchema.type}`);
    }
    const title = jsonSchema.title;
    const enumValues = jsonSchema.enum;
    if (enumValues) {
      if (!Array.isArray(enumValues)) {
        throw new Error(`'enum' property for string type '${title || "anonymous"}' must be an array.`);
      }
      const stringEnumValues = [];
      for (const val of enumValues) {
        stringEnumValues.push(String(val));
      }
      if (title === void 0 || typeof title !== "string") {
        if (stringEnumValues.length === 0) {
          console.warn(`Anonymous enum (string type with 'enum' but no 'title') has no values. Defaulting to plain string type.`);
          return this.tb.string();
        }
        return this.tb.union(stringEnumValues.map((value) => this.tb.literalString(value)));
      }
      const newEnum = this.tb.addEnum(title);
      if (stringEnumValues.length === 0) {
        console.warn(`Enum '${title}' has no values. An empty enum was created.`);
      }
      for (const value of stringEnumValues) {
        newEnum.addValue(value);
      }
      return newEnum.type();
    }
    return this.tb.string();
  }
  _parseArray(jsonSchema) {
    if (jsonSchema.type !== "array") {
      throw new Error(`_parseArray called with non-array type: ${jsonSchema.type}`);
    }
    const itemsSchema = jsonSchema.items;
    if (itemsSchema === void 0) {
      throw new Error(`Array field '${jsonSchema.title || "untitled array"}' is missing 'items' definition.`);
    }
    if (Array.isArray(itemsSchema) || typeof itemsSchema !== "object" || itemsSchema === null) {
      throw new Error(`'items' property for array '${jsonSchema.title || "untitled array"}' must be a single schema object. Tuple/array types for 'items' are not supported by this converter (matching Python script's direct parsing of items).`);
    }
    return this.parse(itemsSchema).list();
  }
  _loadRef(ref) {
    if (!ref.startsWith("#/")) {
      throw new Error(`Only local references are supported: ${ref}`);
    }
    if (this.refCache[ref]) {
      return this.refCache[ref];
    }
    const pathParts = ref.substring(2).split("/");
    if (pathParts.length !== 2 || !pathParts[0] || !pathParts[1]) {
      throw new Error(`Unsupported $ref format: '${ref}'. Expected format like '#/collectionKey/definitionKey' matching Python logic.`);
    }
    const collectionKey = pathParts[0];
    const definitionKey = pathParts[1];
    const collection = this.rootSchema[collectionKey];
    if (typeof collection !== "object" || collection === null) {
      throw new Error(`Reference collection '${collectionKey}' for $ref '${ref}' not found or not an object in the root schema.`);
    }
    if (!collection.hasOwnProperty(definitionKey)) {
      throw new Error(`Reference item '${definitionKey}' for $ref '${ref}' not found in collection '${collectionKey}'.`);
    }
    const targetSchema = collection[definitionKey];
    if (typeof targetSchema !== "object" || targetSchema === null) {
      throw new Error(`Resolved $ref '${ref}' points to a non-object schema.`);
    }
    const fieldType = this.parse(targetSchema);
    this.refCache[ref] = fieldType;
    return fieldType;
  }
  parse(jsonSchema) {
    if (jsonSchema.$ref) {
      if (typeof jsonSchema.$ref !== "string") {
        throw new Error("'$ref' property must be a string.");
      }
      return this._loadRef(jsonSchema.$ref);
    }
    if (jsonSchema.const !== void 0) {
      const constValue = jsonSchema.const;
      if (typeof constValue === "string") {
        return this.tb.literalString(constValue);
      } else if (typeof constValue === "number") {
        if (Number.isInteger(constValue)) {
          return this.tb.literalInt(constValue);
        } else {
          console.warn(
            `JSON Schema 'const' with float value '${constValue}' encountered. BAML will use base type (float) as literalFloat is not available. Title: '${jsonSchema.title || "anonymous"}'`
          );
          return this.tb.float();
        }
      } else if (typeof constValue === "boolean") {
        return this.tb.literalBool(constValue);
      } else if (constValue === null) {
        return this.tb.null();
      }
      if (typeof constValue === "object" && (jsonSchema.type !== "object" && jsonSchema.type !== "array")) {
        console.warn(
          `JSON Schema 'const' with complex value '${JSON.stringify(constValue)}' encountered. Title: '${jsonSchema.title || "anonymous"}'. Expected 'type: "object"' or 'type: "array"' if this const is to be further processed as such. Falling back to standard type parsing based on 'jsonSchema.type' (if present).`
        );
      }
    }
    if (jsonSchema.anyOf) {
      if (!Array.isArray(jsonSchema.anyOf)) {
        throw new Error("'anyOf' property must be an array of schema objects.");
      }
      if (!jsonSchema.anyOf.every((s) => typeof s === "object" && s !== null)) {
        throw new Error("'anyOf' array must contain valid schema objects.");
      }
      if (jsonSchema.anyOf.length === 0) {
        console.warn("'anyOf' is an empty array. Defaulting to string (Python script has no specific handling).");
        return this.tb.string();
      }
      return this.tb.union(jsonSchema.anyOf.map((subSchema) => this.parse(subSchema)));
    }
    const additionalProperties = jsonSchema.additionalProperties;
    if (additionalProperties && typeof additionalProperties === "object" && additionalProperties.anyOf) {
      const apSchema = additionalProperties;
      const anyOfInAp = apSchema.anyOf;
      if (!Array.isArray(anyOfInAp)) {
        throw new Error("'anyOf' in 'additionalProperties' must be an array of schema objects.");
      }
      if (!anyOfInAp.every((s) => typeof s === "object" && s !== null)) {
        throw new Error("'anyOf' in 'additionalProperties' must contain valid schema objects.");
      }
      if (anyOfInAp.length === 0) {
        console.warn("'anyOf' in 'additionalProperties' is empty. Defaulting map value to string.");
        return this.tb.map(this.tb.string(), this.tb.string());
      }
      const valueType = this.tb.union(anyOfInAp.map((subSchema) => this.parse(subSchema)));
      return this.tb.map(this.tb.string(), valueType);
    }
    const type = jsonSchema.type;
    if (type === void 0) {
      console.warn("Type field is missing in JSON schema, defaulting to string (Python script behavior).");
      return this.tb.string();
    }
    if (typeof type !== "string") {
      throw new Error(`Unsupported 'type' format: Expected a string, got ${typeof type} (${JSON.stringify(type)}). Python script would raise ValueError.`);
    }
    let fieldType;
    switch (type) {
      case "string":
        fieldType = this._parseString(jsonSchema);
        break;
      case "number":
        fieldType = this.tb.float();
        break;
      case "integer":
        fieldType = this.tb.int();
        break;
      case "object":
        fieldType = this._parseObject(jsonSchema);
        break;
      case "array":
        fieldType = this._parseArray(jsonSchema);
        break;
      case "boolean":
        fieldType = this.tb.bool();
        break;
      case "null":
        fieldType = this.tb.null();
        break;
      default:
        throw new Error(`Unsupported JSON Schema type: '${type}'`);
    }
    return fieldType;
  }
}
function convertJsonSchemaToBaml(tb, jsonSchema) {
  if (typeof jsonSchema !== "object" || jsonSchema === null) {
    throw new Error("Invalid JSON schema provided. Must be an object.");
  }
  const parser = new SchemaAdder(tb, jsonSchema);
  return parser.parse(jsonSchema);
}
function convertZodToBaml(tb, schema) {
  const jsonSchema = zodToJsonSchema.zodToJsonSchema(schema);
  return convertJsonSchemaToBaml(tb, jsonSchema);
}
function convertActionDefinitionsToBaml(tb, actionVocabulary) {
  const actionTypes = [];
  for (const { name, description, schema } of actionVocabulary) {
    let wrapperSchema;
    const baseWrapperSchema = z.z.object({
      variant: description ? z.z.literal(name).describe(description) : z.z.literal(name)
    });
    if (schema instanceof z.ZodObject) {
      wrapperSchema = baseWrapperSchema.merge(schema);
    } else {
      wrapperSchema = baseWrapperSchema.extend({
        input: schema
      });
    }
    actionTypes.push(convertZodToBaml(tb, wrapperSchema));
  }
  return tb.union(actionTypes);
}

class ModelHarness {
  /**
   * Strong reasoning agent for high level strategy and planning.
   */
  events = new EventEmitter();
  options;
  collector;
  cr;
  baml;
  logger;
  prevTotalInputTokens = 0;
  prevTotalOutputTokens = 0;
  constructor(options) {
    this.options = options;
    this.collector = new baml.Collector("macro");
    this.cr = new baml.ClientRegistry();
    const client = this.options.llm;
    let bamlClientOptions = convertToBamlClientOptions(this.options.llm);
    this.cr.addLlmClient("Macro", client.provider, bamlClientOptions, "DefaultRetryPolicy");
    this.cr.setPrimary("Macro");
    this.baml = b.withOptions({ collector: this.collector, clientRegistry: this.cr });
    this.logger = logger.child({ name: "llm" });
  }
  // getInfo(): ModelUsage {
  //     return {
  //         provider: this.options.client.provider,
  //         model: 'model' in this.options.client.options ?
  //             this.options.client.options.model : 'unknown',
  //         inputTokens: this.collector.usage.inputTokens ?? 0,
  //         outputTokens: this.collector.usage.outputTokens ?? 0,
  //         numCalls: this.collector.logs.length
  //     }
  // }
  reportUsage() {
    const inputTokens = (this.collector.usage.inputTokens ?? 0) - this.prevTotalInputTokens;
    const outputTokens = (this.collector.usage.outputTokens ?? 0) - this.prevTotalOutputTokens;
    const model = this.options.llm.options.model ?? "unknown";
    const knownCostMap = {
      "gemini-2.5-pro": [1.25, 10],
      "gemini-2.5-flash": [0.15, 0.6],
      "claude-3.5-sonnet": [3, 15],
      "claude-3.7-sonnet": [3, 15],
      "claude-sonnet-4": [3, 15],
      "claude-opus-4": [15, 75],
      "gpt-4.1": [2, 8],
      "gpt-4.1-mini": [0.4, 1.6],
      "gpt-4.1-nano": [0.1, 0.4],
      "gpt-4o": [3.75, 15],
      // Assuming Nebius prices, may be higher
      "qwen2.5-vl-72b": [0.25, 0.75]
    };
    let inputTokenCost;
    let outputTokenCost;
    for (const [name, costs] of Object.entries(knownCostMap)) {
      if (model.includes(name)) {
        inputTokenCost = costs[0] / 1e6;
        outputTokenCost = costs[0] / 1e6;
      }
    }
    const usage = {
      llm: {
        provider: this.options.llm.provider,
        model
      },
      //this.options.llm,
      inputTokens,
      outputTokens,
      ...inputTokenCost ? { inputCost: inputTokens * inputTokenCost } : {},
      ...outputTokenCost ? { outputCost: outputTokens * outputTokenCost } : {}
    };
    this.events.emit("tokensUsed", usage);
    this.prevTotalInputTokens = inputTokens;
    this.prevTotalOutputTokens = outputTokens;
  }
  async createPartialRecipe(context, task, actionVocabulary) {
    const tb = new TypeBuilder();
    tb.PartialRecipe.addProperty("actions", tb.list(convertActionDefinitionsToBaml(tb, actionVocabulary)));
    const start = Date.now();
    const response = await this.baml.CreatePartialRecipe(
      context,
      task,
      { tb }
    );
    this.logger.trace(`createPartialRecipe took ${Date.now() - start}ms`);
    this.reportUsage();
    return {
      reasoning: response.reasoning,
      //(response.observations ? response.observations + " " : "") + response.meta_reasoning + " " + response.reasoning,
      actions: response.actions
      // as z.infer<ActionDefinition<T>['schema']>[]
    };
  }
  async extract(instructions, schema, screenshot, domContent) {
    const tb = new TypeBuilder();
    if (schema instanceof z.z.ZodObject) {
      for (const [key, fieldSchema] of Object.entries(schema.shape)) {
        tb.ExtractedData.addProperty(key, convertZodToBaml(tb, fieldSchema));
      }
    } else {
      tb.ExtractedData.addProperty("data", convertZodToBaml(tb, schema));
    }
    const resp = await this.baml.ExtractData(instructions, await screenshot.toBaml(), domContent, { tb });
    this.reportUsage();
    if (schema instanceof z.z.ZodObject) {
      return resp;
    } else {
      return resp.data;
    }
  }
  // ^ extract could prob be a subset of query w trimmed mem
  async query(context, query, schema) {
    const tb = new TypeBuilder();
    if (schema instanceof z.z.ZodObject) {
      for (const [key, fieldSchema] of Object.entries(schema.shape)) {
        tb.QueryResponse.addProperty(key, convertZodToBaml(tb, fieldSchema));
      }
    } else {
      tb.QueryResponse.addProperty("data", convertZodToBaml(tb, schema));
    }
    const resp = await this.baml.QueryMemory(
      context,
      query,
      { tb }
    );
    this.reportUsage();
    if (schema instanceof z.z.ZodObject) {
      return resp;
    } else {
      return resp.data;
    }
  }
  // async classifyCheckFailure(screenshot: Image, check: string, existingRecipe: Action[], tabState: TabState): Promise<BugDetectedFailure | MisalignmentFailure> {
  //     const stringifiedExistingRecipe = [];
  //     for (const action of existingRecipe) {
  //         stringifiedExistingRecipe.push(JSON.stringify(action, null, 4))
  //     }
  //     const start = Date.now();
  //     const response = await this.baml.ClassifyCheckFailure(
  //         {
  //             screenshot: await screenshot.toBaml(),//Image.fromBase64('image/png', screenshot.image),
  //             actionHistory: stringifiedExistingRecipe,
  //             tabState: tabState
  //         },
  //         check
  //     );
  //     this.logger.trace(`classifyCheckFailure took ${Date.now()-start}ms`);
  //     //return response.check;
  //     if (response.classification === 'bug') {
  //         return {
  //             variant: 'bug',
  //             title: response.title,
  //             expectedResult: response.expectedResult,
  //             actualResult: response.actualResult,
  //             severity: response.severity
  //         }
  //     }
  //     else {
  //         return {
  //             variant: 'misalignment',
  //             message: response.message
  //         }
  //     }
  // }
  // async diagnoseTargetNotFound(
  //     screenshot: Screenshot,
  //     step: TestStepDefinition,
  //     target: string,
  //     existingRecipe: ActionIngredient[]
  // ): Promise<BugDetectedFailure | MisalignmentFailure> {
  //     const downscaledScreenshot = await this.transformScreenshot(screenshot);
  //     const stringifiedExistingRecipe = [];
  //     for (const action of existingRecipe) {
  //         stringifiedExistingRecipe.push(JSON.stringify(action, null, 4))
  //     }
  //     const start = Date.now();
  //     const response = await this.baml.DiagnoseTargetNotFound(
  //         Image.fromBase64('image/png', downscaledScreenshot.image),
  //         step,
  //         target,
  //         //action.target,
  //         //JSON.stringify(action, null, 4),//action,
  //         stringifiedExistingRecipe
  //     );
  //     this.logger.trace(`classifyStepActionFailure took ${Date.now()-start}ms`);
  //     if (response.classification === 'bug') {
  //         return {
  //             variant: 'bug',
  //             title: response.title,
  //             expectedResult: response.expectedResult,
  //             actualResult: response.actualResult,
  //             severity: response.severity
  //         }
  //     }
  //     else {
  //         return {
  //             variant: 'misalignment',
  //             message: response.message
  //         }
  //     }
  // }
}

function fnv1a32Hex(str, seed = 2166136261) {
  const FNV_PRIME_32 = 16777619;
  let hash = seed;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    hash = hash * FNV_PRIME_32 | 0;
  }
  const hexString = (hash >>> 0).toString(16);
  return hexString.padStart(8, "0");
}

class Image {
  /**
   * Wrapper for a Sharp image with conveniences to go to/from base64, convert to BAML, or serialize as JSON
   */
  // represents the start of a pipeline
  img;
  // Cached metadata property for sync access + required width/height properties
  //private metadata: Sharp['metadata'] & { width: number, height: number };
  //private content: string;
  //private mediaType: ImageMediaType;
  //constructor(type: 'url' | 'base64', content: string, mediaType: ImageMediaType) {
  constructor(img) {
    this.img = img;
  }
  static fromBase64(base64) {
    const base64Data = base64.replace(/^data:.*?;base64,/, "");
    return new Image(sharp(Buffer.from(base64Data, "base64")));
  }
  async getFormat() {
    const format = (await this.img.clone().metadata()).format;
    if (!format) throw new Error("Unable to get image format");
    return format;
  }
  /**
   * Convert the image to a JSON representation
   */
  async toJson() {
    return {
      type: "media",
      //mediaType: this.mediaType,//`image/${this.mediaType}`,
      format: await this.getFormat(),
      storage: "base64",
      base64: await this.toBase64()
      //this.content
    };
  }
  async toBase64() {
    const base64data = (await this.img.clone().toBuffer()).toString("base64");
    return base64data;
  }
  async toBaml() {
    const format = await this.getFormat();
    const data = await this.toBase64();
    return baml.Image.fromBase64(`image/${format}`, data);
  }
  async saveToFile(filepath) {
    await this.img.clone().toFile(filepath);
  }
  async getDimensions() {
    const { info: { width, height } } = await this.img.clone().toBuffer({ resolveWithObject: true });
    if (!width || !height) throw new Error("Unable to get dimensions from image");
    return { width, height };
  }
  async resize(width, height) {
    const resizedImage = new Image(await this.img.clone().resize({
      // Round width/height since sometimes they are floats due to rounding errors - sharp will throw if not integers
      width: Math.round(width),
      height: Math.round(height),
      fit: "fill",
      // exact size, no cropping
      kernel: sharp.kernel.lanczos3
    }));
    return resizedImage;
  }
}

async function buildXmlPartsRecursive(data, indentLevel, partsList, isInsideList = false) {
  const indent = "  ".repeat(indentLevel);
  if (data instanceof Image) {
    const bamlImg = await data.toBaml();
    if (bamlImg) {
      partsList.push(bamlImg);
    }
    return;
  }
  if (data instanceof baml.Image) {
    partsList.push(data);
    return;
  }
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean" || data === null) {
    partsList.push(String(data));
    return;
  }
  if (data === void 0) {
    return;
  }
  if (Array.isArray(data)) {
    for (let index = 0; index < data.length; index++) {
      await buildXmlPartsRecursive(data[index], indentLevel, partsList, true);
      if (index < data.length - 1) {
        partsList.push("\n");
      }
    }
    return;
  }
  if (typeof data === "object" && data !== null) {
    const objectEntries = Object.entries(data).filter(([, val]) => val !== void 0);
    objectEntries.forEach(async ([key, value], entryIndex) => {
      const tagName = key;
      const currentValueParts = [];
      await buildXmlPartsRecursive(value, indentLevel + 1, currentValueParts, false);
      const mergedValueParts = [];
      let currentStr = "";
      for (const part of currentValueParts) {
        if (typeof part === "string") {
          currentStr += part;
        } else {
          if (currentStr) mergedValueParts.push(currentStr);
          currentStr = "";
          mergedValueParts.push(part);
        }
      }
      if (currentStr) mergedValueParts.push(currentStr);
      if (mergedValueParts.length === 1 && mergedValueParts[0] instanceof baml.Image) {
        partsList.push(`${indent}<${tagName}>`);
        partsList.push(mergedValueParts[0]);
        partsList.push(`</${tagName}>`);
      } else if (mergedValueParts.length === 1 && typeof mergedValueParts[0] === "string") {
        const contentStr = mergedValueParts[0];
        if (contentStr.includes("\n")) {
          partsList.push(`${indent}<${tagName}>
${contentStr}
${indent}</${tagName}>`);
        } else {
          partsList.push(`${indent}<${tagName}>${contentStr}</${tagName}>`);
        }
      } else {
        partsList.push(`${indent}<${tagName}>
`);
        mergedValueParts.forEach((part, partIdx) => {
          partsList.push(part);
          if (partIdx < mergedValueParts.length - 1) {
            partsList.push("\n");
          }
        });
        partsList.push(`
${indent}</${tagName}>`);
      }
      if (entryIndex < objectEntries.length - 1) {
        partsList.push("\n");
      }
    });
    return;
  }
  throw new Error(`Object type not supported for LLM context: ${typeof data}`);
}
async function observableDataToContext(data) {
  const rawList = [];
  await buildXmlPartsRecursive(data, 0, rawList);
  if (rawList.length === 0) {
    return [];
  }
  const mergedList = [];
  let currentString = "";
  for (const item of rawList) {
    if (typeof item === "string") {
      currentString += item;
    } else {
      if (currentString.length > 0) {
        mergedList.push(currentString);
      }
      currentString = "";
      mergedList.push(item);
    }
  }
  if (currentString.length > 0) {
    mergedList.push(currentString);
  }
  return mergedList;
}

async function observableDataToJson(data) {
  if (data instanceof Image) {
    return await data.toJson();
  }
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return { type: "primitive", content: data };
  }
  if (data === void 0) {
    return void 0;
  }
  if (data === null) {
    return null;
  }
  if (Array.isArray(data)) {
    return Promise.all(
      data.filter((item) => item !== void 0).map((item) => observableDataToJson(item))
    );
  }
  if (typeof data === "object") {
    const processedObject = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        const processedValue = observableDataToJson(value);
        if (processedValue !== void 0) {
          processedObject[key] = processedValue;
        }
      }
    }
    return processedObject;
  }
  return void 0;
}

class Observation {
  source;
  timestamp;
  data;
  options;
  constructor(source, data, options) {
    this.source = source;
    this.data = data;
    this.timestamp = Date.now();
    this.options = options;
  }
  static fromConnector(connectorId, data, options) {
    return new Observation(`connector:${connectorId}`, data, options);
  }
  static fromActionTaken(actionId, data, options) {
    return new Observation(`action:taken:${actionId}`, data, options);
  }
  static fromActionResult(actionId, data, options) {
    return new Observation(`action:result:${actionId}`, data, options);
  }
  static fromThought(data, options) {
    return new Observation(`thought`, data, options);
  }
  toString() {
    return JSON.stringify(this.data);
  }
  async toJson() {
    return await observableDataToJson(this.data);
  }
  async toContext() {
    return await observableDataToContext(this.data);
  }
  async hash() {
    const stringifiedContent = JSON.stringify(await this.toJson());
    return fnv1a32Hex(stringifiedContent);
  }
  async equals(obs) {
    return await this.hash() == await obs.hash();
  }
}
async function filterObservations(observations) {
  const observationsByType = /* @__PURE__ */ new Map();
  for (const obs of observations) {
    if (obs.options && obs.options.type) {
      const type = obs.options.type;
      if (!observationsByType.has(type)) {
        observationsByType.set(type, {
          obsList: [],
          limit: obs.options.limit,
          dedupe: obs.options.dedupe
        });
      }
      observationsByType.get(type).obsList.push(obs);
    }
  }
  for (const data of observationsByType.values()) {
    let currentTypedObservations = data.obsList;
    if (data.dedupe && currentTypedObservations.length > 1) {
      const dedupedList = [];
      dedupedList.unshift(currentTypedObservations[currentTypedObservations.length - 1]);
      for (let i = currentTypedObservations.length - 2; i >= 0; i--) {
        const currentObs = currentTypedObservations[i];
        const lastKeptObs = dedupedList[0];
        if (!await currentObs.equals(lastKeptObs)) {
          dedupedList.unshift(currentObs);
        }
      }
      currentTypedObservations = dedupedList;
    }
    if (data.limit !== void 0 && data.limit >= 0) {
      if (data.limit === 0) {
        currentTypedObservations = [];
      } else {
        currentTypedObservations = currentTypedObservations.slice(-data.limit);
      }
    }
    data.obsList = currentTypedObservations;
  }
  const finalObservationsToRender = [];
  const survivorSets = /* @__PURE__ */ new Map();
  for (const [type, data] of observationsByType.entries()) {
    survivorSets.set(type, new Set(data.obsList));
  }
  for (const originalObs of observations) {
    if (originalObs.options && originalObs.options.type) {
      if (survivorSets.get(originalObs.options.type)?.has(originalObs)) {
        finalObservationsToRender.push(originalObs);
      }
    } else {
      finalObservationsToRender.push(originalObs);
    }
  }
  return finalObservationsToRender;
}
async function renderObservations(observations) {
  const filteredObservations = await filterObservations(observations);
  let content = [];
  for (const obs of filteredObservations) {
    if (obs.source.startsWith("action:taken") || obs.source.startsWith("thought")) {
      content.push(`[${new Date(obs.timestamp).toTimeString().split(" ")[0]}]: `);
    }
    content = [...content, ...await obs.toContext(), "\n"];
  }
  return content;
}

class AgentError extends Error {
  //public readonly failure: FailureDescriptor;
  options;
  constructor(message, options = {}) {
    super(message);
    this.options = {
      variant: options.variant ?? "unknown",
      adaptable: options.adaptable ?? false
    };
  }
}

class AgentMemory {
  //public readonly events: EventEmitter<AgentMemoryEvents> = new EventEmitter();
  //private options: Required<MemoryOptions>;
  //private history: StoredHistoryEntry[] = [];
  // Custom instructions relating to this memory instance (e.g. agent-level and/or task-level instructions)
  instructions;
  observations = [];
  //private tasks: { task: string, observations: Observation[] }[] = [];
  constructor(instructions) {
    this.instructions = instructions ?? null;
  }
  // get observations(): Observation[] {
  //     if (this.tasks.length === 0) {
  //     }
  //     return this.tasks.at(-1).observations
  // }
  // public newTask(task: string): void {
  //     // Mark start of task for a new isolated memory window
  // }
  isEmpty() {
    return this.observations.length === 0;
  }
  recordThought(content) {
    this.observations.push(
      Observation.fromThought(content)
    );
  }
  recordObservation(obs) {
    this.observations.push(obs);
  }
  getLastThoughtMessage() {
    for (let i = this.observations.length - 1; i >= 0; i--) {
      const obs = this.observations[i];
      if (obs.source.startsWith("thought")) return obs.toString();
    }
    return null;
  }
  async buildContext(activeConnectors) {
    const content = await renderObservations(this.observations);
    const connectorInstructions = [];
    for (const connector of activeConnectors) {
      if (connector.getInstructions) {
        const instructions = await connector.getInstructions();
        if (instructions) {
          connectorInstructions.push({
            connectorId: connector.id,
            instructions
          });
        }
      }
    }
    return {
      instructions: this.instructions,
      observationContent: content,
      connectorInstructions
    };
  }
  async toJSON() {
    const observations = [];
    for (const observation of this.observations) {
      observations.push({
        source: observation.source,
        timestamp: observation.timestamp,
        data: await observableDataToJson(observation.data),
        options: observation.options
      });
    }
    return {
      ...this.instructions ? { instructions: this.instructions } : {},
      observations
    };
  }
}

function createAction(action) {
  return {
    name: action.name,
    description: action.description,
    schema: action.schema ?? z.z.object({}),
    resolver: action.resolver,
    render: action.render ?? ((action2) => JSON.stringify(action2))
  };
}

const doneAction = createAction({
  name: "task:done",
  description: "ONLY once you have seen sufficient evidence of the task's completion, mark it as done",
  //Use once sure that task is finished',//'Designate current task as finished',// Do not use until you can verify the task is completed.
  schema: z.z.object({
    evidence: z.z.string().describe(`Specific observed evidence that verifies the task's completion. Do NOT predict this evidence.`)
  }),
  resolver: async ({ agent }) => {
    agent.queueDone();
  },
  render: () => `\u2713 done`
});
const failAction = createAction({
  name: "task:fail",
  description: "Use if task was attempted but does not seem possible. Use common sense",
  //'Designate current task as infeasible',
  schema: z.z.object({}),
  resolver: async ({ agent }) => {
    throw new AgentError(`Task failed: ${agent.memory.getLastThoughtMessage() ?? "No thought recorded"}`);
  },
  render: () => `\u2715 fail`
});
const taskActions = [
  doneAction,
  failAction
];

const require$1 = node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href)));
const VERSION = require$1("../package.json").version;

const createId = cuid2.init({ length: 12 });
const posthog = new posthogNode.PostHog(
  "phc_BTdnTtG68V5QG6sqUNGqGfmjXk8g0ePBRu9FIr9upNu",
  {
    host: "https://us.i.posthog.com"
  }
);
function getMachineId() {
  const dir = path__namespace.join(os__namespace.homedir(), ".magnitude");
  const filePath = path__namespace.join(dir, "user.json");
  try {
    if (fs__namespace.existsSync(filePath)) {
      const data = JSON.parse(fs__namespace.readFileSync(filePath, "utf8"));
      if (data.id) return data.id;
    }
    fs__namespace.mkdirSync(dir, { recursive: true });
    const id = createId();
    fs__namespace.writeFileSync(filePath, JSON.stringify({ id }));
    return id;
  } catch {
    return createId();
  }
}
function getCodebaseId() {
  try {
    const command = "git rev-list --max-parents=0 HEAD";
    const firstCommitHash = node_child_process.execSync(command, {
      encoding: "utf8",
      stdio: "pipe"
    }).trim();
    return crypto.createHash("sha256").update(firstCommitHash).digest("hex").substring(0, 12);
  } catch (error) {
    return void 0;
  }
}
async function sendTelemetry(eventName, properties) {
  const userId = getMachineId();
  const codebaseId = getCodebaseId();
  if (codebaseId) {
    try {
      posthog.groupIdentify({
        groupType: "codebase",
        groupKey: codebaseId
        //properties: {}
      });
    } catch (error) {
      logger.warn(`Failed to identify group: ${error.message}`);
    }
  }
  try {
    const props = {
      source: "magnitude-core",
      packageVersion: VERSION,
      //telemetryVersion: "0.1",
      codebase: codebaseId,
      ...properties
    };
    posthog.capture({
      distinctId: userId,
      event: eventName,
      properties: props,
      ...codebaseId ? { groups: { codebase: codebaseId } } : {}
    });
    await posthog.shutdown();
  } catch (error) {
    logger.warn(`Failed to send telemetry (may have timed out): ${error.message}`);
  }
}

function addUsageToReport(report, usage) {
  const modelHash = JSON.stringify(usage.llm);
  let exists = false;
  for (const entry of report) {
    const compare = JSON.stringify(usage.llm);
    if (modelHash === compare) {
      exists = true;
      entry.inputTokens += usage.inputTokens;
      entry.outputTokens += usage.outputTokens;
      entry.numCalls += 1;
    }
  }
  if (!exists) {
    report.push({ ...usage, numCalls: 1 });
  }
}
function telemetrifyAgent(agent) {
  const agentId = createId();
  agent.events.on("start", async () => {
    await sendTelemetry("agent-start", { agentId });
  });
  agent.events.on("stop", async () => {
    await sendTelemetry("agent-stop", { agentId });
  });
  agent.events.on("actStarted", async () => {
    const startedAt = Date.now();
    const report = [];
    let actionCount = 0;
    const tokenListener = (usage) => {
      addUsageToReport(report, usage);
    };
    agent.events.on("tokensUsed", tokenListener);
    const actionListener = () => {
      actionCount++;
    };
    agent.events.on("actionDone", actionListener);
    agent.events.once("actDone", async () => {
      agent.events.removeListener("tokensUsed", tokenListener);
      agent.events.removeListener("actionDone", actionListener);
      const doneAt = Date.now();
      await sendTelemetry("agent-act", {
        agentId,
        startedAt,
        doneAt,
        actionCount,
        modelUsage: report
      });
    });
  });
  if (agent.hasOwnProperty("browserAgentEvents")) {
    const browserAgent = agent;
    browserAgent.browserAgentEvents.on("nav", async () => {
      await sendTelemetry("agent-nav", { agentId });
    });
    browserAgent.browserAgentEvents.on("extractStarted", async () => {
      const startedAt = Date.now();
      const report = [];
      const tokenListener = (usage) => {
        addUsageToReport(report, usage);
      };
      browserAgent.events.on("tokensUsed", tokenListener);
      browserAgent.browserAgentEvents.once("extractDone", async () => {
        browserAgent.events.removeListener("tokensUsed", tokenListener);
        const doneAt = Date.now();
        await sendTelemetry("agent-extract", {
          agentId,
          startedAt,
          doneAt,
          modelUsage: report
        });
      });
    });
  }
}

const DEFAULT_CONFIG = {
  actions: [...taskActions],
  // Default to taskActions; other actions come from connectors
  connectors: [],
  llm: {
    provider: "google-ai",
    options: {
      model: "gemini-2.5-pro-preview-05-06",
      apiKey: process.env.GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY"
    }
  },
  prompt: null,
  telemetry: true
};
class Agent {
  // maybe remove conns/actions from options since stored sep
  options;
  //Omit<Required<AgentOptions>, 'actions'>;
  connectors;
  actions;
  // actions from connectors + any other additional ones configured
  model;
  //public readonly micro: GroundingService;
  //public readonly events: EventEmitter<AgentEvents>;
  //protected readonly _emitter: EventEmitter<AgentEvents>;
  events = new EventEmitter();
  //public readonly memory: AgentMemory;
  doneActing;
  latestTaskMemory;
  // | null = null;
  constructor(baseConfig = {}) {
    this.options = {
      ...DEFAULT_CONFIG,
      ...baseConfig,
      connectors: baseConfig.connectors ?? [],
      actions: [...baseConfig.actions || DEFAULT_CONFIG.actions]
    };
    this.connectors = this.options.connectors;
    this.actions = [...this.options.actions];
    for (const connector of this.connectors) {
      this.actions.push(...connector.getActionSpace ? connector.getActionSpace() : []);
    }
    this.model = new ModelHarness({ llm: this.options.llm });
    this.model.events.on("tokensUsed", (usage) => this.events.emit("tokensUsed", usage), this);
    this.doneActing = false;
    this.latestTaskMemory = new AgentMemory();
  }
  getConnector(connectorClass) {
    return this.connectors.find((c) => c instanceof connectorClass);
  }
  require(connectorClass) {
    const connector = this.getConnector(connectorClass);
    if (!connector) throw new Error(`Missing required connector ${connectorClass}`);
    return connector;
  }
  async start() {
    if (this.options.telemetry) telemetrifyAgent(this);
    logger.info("Agent: Starting connectors...");
    for (const connector of this.connectors) {
      if (connector.onStart) await connector.onStart();
    }
    this.events.emit("start");
    logger.info("Agent: All connectors started.");
  }
  identifyAction(action) {
    const actionDefinition = this.actions.find((def) => def.name === action.variant);
    if (!actionDefinition) {
      throw new AgentError(`Undefined action type '${action.variant}'. Ensure agent is configured with appropriate action definitions from connectors.`);
    }
    return actionDefinition;
  }
  async exec(action, memory) {
    let actionDefinition = this.identifyAction(action);
    let input;
    if (actionDefinition.schema instanceof z.ZodObject) {
      let variant;
      ({ variant, ...input } = action);
    } else {
      input = action.input;
    }
    let parsed = actionDefinition.schema.safeParse(input);
    if (!parsed.success) {
      throw new AgentError(`Generated action '${action.variant}' violates input schema: ${parsed.error.message}`, { adaptable: true });
    }
    this.events.emit("actionStarted", action);
    const data = await actionDefinition.resolver(
      { input: parsed.data, agent: this }
    );
    this.events.emit("actionDone", action);
    if (memory) {
      memory.recordObservation(Observation.fromActionTaken(actionDefinition.name, JSON.stringify(action)));
      if (data) {
        memory.recordObservation(Observation.fromActionResult(actionDefinition.name, data));
      }
      await this._recordConnectorObservations(memory);
    }
  }
  async _recordConnectorObservations(memory) {
    for (const connector of this.connectors) {
      try {
        const connObservations = connector.collectObservations ? await connector.collectObservations() : [];
        for (const obs of connObservations) {
          memory.recordObservation(obs);
        }
      } catch (error) {
        logger.warn(`Agent: Error getting observations from connector ${connector.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  get memory() {
    return this.latestTaskMemory;
  }
  async act(taskOrSteps, options = {}) {
    const instructions = [
      ...this.options.prompt ? [this.options.prompt] : [],
      ...options.prompt ? [options.prompt] : []
    ].join("\n");
    const taskMemory = new AgentMemory(instructions === "" ? void 0 : instructions);
    if (Array.isArray(taskOrSteps)) {
      const steps = taskOrSteps;
      await traceAsync("multistep", async (steps2, options2) => {
        for (const step of steps2) {
          this.events.emit("actStarted", step, options2);
          await this._traceAct(step, taskMemory, options2);
          this.events.emit("actDone", step, options2);
        }
      })(steps, options);
    } else {
      const task = taskOrSteps;
      this.events.emit("actStarted", task, options);
      await this._traceAct(task, taskMemory, options);
      this.events.emit("actDone", task, options);
    }
  }
  async _traceAct(task, memory, options = {}) {
    await traceAsync("act", async (task2, options2) => {
      await this._act(task2, memory, options2);
    })(task, options);
  }
  async _act(description, memory, options = {}) {
    this.doneActing = false;
    logger.info(`Act: ${description}`);
    if (options.data) {
      description += "\n<data>\n";
      if (typeof options.data === "string") {
        description += options.data;
      } else {
        description += Object.entries(options.data).map(([k, v]) => `${k}: ${v}`).join("\n");
      }
      description += "\n</data>";
    }
    this.latestTaskMemory = memory;
    logger.info("Making initial observations...");
    await this._recordConnectorObservations(memory);
    logger.info("Initial observations recorded");
    while (true) {
      logger.info(`Creating partial recipe`);
      let reasoning;
      let actions;
      try {
        const memoryContext = await memory.buildContext(this.connectors);
        ({ reasoning, actions } = await this.model.createPartialRecipe(
          memoryContext,
          description,
          this.actions
        ));
      } catch (error) {
        logger.error(`Agent: Error creating partial recipe: ${error instanceof Error ? error.message : String(error)}`);
        throw new AgentError(
          `Could not create partial recipe -> ${error.message}`,
          { variant: "misalignment" }
        );
      }
      logger.info({ reasoning, actions }, `Partial recipe created`);
      this.events.emit("thought", reasoning);
      memory.recordThought(reasoning);
      for (const action of actions) {
        await this.exec(action, memory);
        logger.info({ action }, `Action taken`);
      }
      if (this.doneActing) {
        break;
      }
    }
    logger.info(`Done with step`);
  }
  async query(query, schema) {
    const memoryContext = await this.memory.buildContext(this.connectors);
    return await this.model.query(memoryContext, query, schema);
  }
  async queueDone() {
    this.doneActing = true;
  }
  async stop() {
    logger.info("Agent: Stopping connectors...");
    for (const connector of this.connectors) {
      try {
        if (connector.onStop) await connector.onStop();
      } catch (error) {
        logger.warn(`Agent: Error stopping connector ${connector.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    this.events.emit("stop");
    logger.info("Agent: All connectors stopped.");
    logger.info("Agent: Stopped successfully.");
  }
  // async dumpMemoryJSON() {
  //     return await this.memory.toJSON();
  // }
}

const DEFAULT_PAGE_STABILITY_TIMEOUT = 5e3;
const DEFAULT_MINIMUM_WAIT_PAGE_LOAD_TIME = 500;
const DEFAULT_WAIT_FOR_NETWORK_IDLE_TIME = 500;
const DEFAULT_MAXIMUM_WAIT_PAGE_LOAD_TIME = 5e3;
class PageStabilityAnalyzer {
  page;
  options;
  lastStart;
  logger;
  constructor(options = {}) {
    this.options = {
      differenceThreshold: options.differenceThreshold ?? 0.01,
      requiredStableChecks: options.requiredStableChecks ?? 3,
      checkInterval: options.checkInterval ?? 100,
      // 200ms
      minimumWaitPageLoadTime: options.minimumWaitPageLoadTime ?? DEFAULT_MINIMUM_WAIT_PAGE_LOAD_TIME,
      waitForNetworkIdleTime: options.waitForNetworkIdleTime ?? DEFAULT_WAIT_FOR_NETWORK_IDLE_TIME,
      maximumWaitPageLoadTime: options.maximumWaitPageLoadTime ?? DEFAULT_MAXIMUM_WAIT_PAGE_LOAD_TIME
    };
    this.lastStart = Date.now();
    this.logger = logger.child(
      { name: "magnus.stability" }
    );
  }
  setActivePage(page) {
    this.page = page;
  }
  log(message) {
    this.logger.trace(`[${Date.now() - this.lastStart}ms] ${message}`);
  }
  /**
   * Compare two screenshots and return their difference score
   * @returns Difference as float between 0-1, where 0 means identical
   */
  async compareScreenshots(screenshot1, screenshot2) {
    try {
      const img1 = await sharp(screenshot1).raw().toBuffer({ resolveWithObject: true });
      const img2 = await sharp(screenshot2).raw().toBuffer({ resolveWithObject: true });
      if (img1.info.width !== img2.info.width || img1.info.height !== img2.info.height) {
        return {
          difference: 1,
          error: "Image sizes don't match"
        };
      }
      let diffSum = 0;
      for (let i = 0; i < img1.data.length; i++) {
        diffSum += Math.abs(img1.data[i] - img2.data[i]);
      }
      const mse = diffSum / img1.data.length;
      const maxDiff = 255 * (img1.info.channels || 3);
      const normalizedDiff = mse / maxDiff;
      return { difference: normalizedDiff };
    } catch (e) {
      return {
        difference: 1,
        error: `Comparison failed: ${e instanceof Error ? e.message : String(e)}`
      };
    }
  }
  /**
   * Wait for the network to become stable
   * This monitors network requests and waits until there's a period of inactivity
   * @param timeout Maximum time to wait for network stability
   */
  async waitForNetworkStability(timeout) {
    const maxWaitTime = timeout ?? this.options.maximumWaitPageLoadTime;
    const start = Date.now();
    this.log("Checking network stability");
    const pendingRequests = /* @__PURE__ */ new Set();
    let lastActivity = Date.now();
    const RELEVANT_RESOURCE_TYPES = /* @__PURE__ */ new Set([
      "document",
      "stylesheet",
      "image",
      "font",
      "script",
      "fetch",
      "xhr",
      "iframe"
    ]);
    const RELEVANT_CONTENT_TYPES = [
      "text/html",
      "text/css",
      "application/javascript",
      "image/",
      "font/",
      "application/json"
    ];
    const IGNORED_URL_PATTERNS = [
      // Analytics and tracking
      "analytics",
      "tracking",
      "telemetry",
      "beacon",
      "metrics",
      // Ad-related
      "doubleclick",
      "adsystem",
      "adserver",
      "advertising",
      // Social media widgets
      "facebook.com/plugins",
      "platform.twitter",
      "linkedin.com/embed",
      // Live chat and support
      "livechat",
      "zendesk",
      "intercom",
      "crisp.chat",
      "hotjar",
      // Push notifications
      "push-notifications",
      "onesignal",
      "pushwoosh",
      // Background sync/heartbeat
      "heartbeat",
      "ping",
      "alive",
      // WebRTC and streaming
      "webrtc",
      "rtmp://",
      "wss://",
      // Common CDNs for dynamic content
      "cloudfront.net",
      "fastly.net"
    ];
    const onRequest = (request) => {
      if (!RELEVANT_RESOURCE_TYPES.has(request.resourceType())) {
        return;
      }
      if (["websocket", "media", "eventsource", "manifest", "other"].includes(request.resourceType())) {
        return;
      }
      const url = request.url().toLowerCase();
      if (IGNORED_URL_PATTERNS.some((pattern) => url.includes(pattern))) {
        return;
      }
      if (url.startsWith("data:") || url.startsWith("blob:")) {
        return;
      }
      pendingRequests.add(request);
      lastActivity = Date.now();
      this.log(`Request started: ${request.url()}`);
    };
    const onResponse = (response) => {
      const request = response.request();
      if (!pendingRequests.has(request)) {
        return;
      }
      const contentType = response.headers()["content-type"] || "";
      if (["streaming", "video", "audio", "webm", "mp4", "event-stream", "websocket", "protobuf"].some((t) => contentType.includes(t))) {
        pendingRequests.delete(request);
        return;
      }
      if (!RELEVANT_CONTENT_TYPES.some((ct) => contentType.includes(ct))) {
        pendingRequests.delete(request);
        return;
      }
      const contentLength = parseInt(response.headers()["content-length"] || "0", 10);
      if (contentLength > 5 * 1024 * 1024) {
        pendingRequests.delete(request);
        return;
      }
      pendingRequests.delete(request);
      lastActivity = Date.now();
      this.log(`Request resolved: ${request.url()}`);
    };
    this.page.on("request", onRequest);
    this.page.on("response", onResponse);
    try {
      const startTime = Date.now();
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const now = Date.now();
        if (pendingRequests.size === 0 && now - lastActivity >= this.options.waitForNetworkIdleTime) {
          break;
        }
        if (now - startTime > maxWaitTime) {
          this.log(`Network timeout after ${maxWaitTime}ms with ${pendingRequests.size} pending requests`);
          break;
        }
      }
    } finally {
      this.page.removeListener("request", onRequest);
      this.page.removeListener("response", onResponse);
    }
    const totalTime = (Date.now() - start) / 1e3;
    this.log(`Network stabilized in ${totalTime.toFixed(2)}s`);
  }
  /**
   * Wait for the page to become visually stable
   * @param timeout Maximum time to wait for stability in ms
   */
  async waitForVisualStability(timeout = DEFAULT_PAGE_STABILITY_TIMEOUT) {
    const start = Date.now();
    this.log("Checking visual stability");
    try {
      let lastScreenshot = await this.page.screenshot();
      let stabilityCount = 0;
      const deadline = start + timeout;
      while (Date.now() < deadline) {
        this.log(`Waiting for ${this.options.checkInterval}`);
        await this.page.waitForTimeout(this.options.checkInterval);
        this.log(`Done waiting`);
        try {
          this.log("Taking screenshot...");
          const currentScreenshot = await this.page.screenshot();
          this.log("Comparing screenshots...");
          const diffResult = await this.compareScreenshots(lastScreenshot, currentScreenshot);
          if (diffResult.error) {
            this.log(`Comparison error: ${diffResult.error}`);
            stabilityCount = 0;
          } else {
            this.log(`Screenshot difference: ${diffResult.difference.toFixed(4)}`);
            if (diffResult.difference < this.options.differenceThreshold) {
              stabilityCount++;
              if (stabilityCount >= this.options.requiredStableChecks) {
                this.log(`Visual stability achieved (difference: ${diffResult.difference.toFixed(4)})`);
                return;
              }
            } else {
              stabilityCount = 0;
            }
          }
          lastScreenshot = currentScreenshot;
        } catch (e) {
          this.log(`Screenshot/comparison error: ${e instanceof Error ? e.message : String(e)}`);
          stabilityCount = 0;
        }
      }
      this.log("Visual stability check timed out");
    } catch (e) {
      this.log(`Visual stability check error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      const totalTime = (Date.now() - start) / 1e3;
      this.log(`Visual stability check took ${totalTime.toFixed(2)}s`);
    }
  }
  /**
   * Wait for both network and visual stability
   * @param timeout Maximum time to wait for page load
   */
  async waitForStability(timeout) {
    const maxWaitTime = timeout ?? this.options.maximumWaitPageLoadTime;
    const startTime = Date.now();
    this.lastStart = startTime;
    const minWaitDeadline = startTime + this.options.minimumWaitPageLoadTime;
    const maxWaitDeadline = startTime + maxWaitTime;
    this.log(`Starting stability wait (min: ${this.options.minimumWaitPageLoadTime}ms, max: ${maxWaitTime}ms)`);
    try {
      const remainingForNetwork = Math.max(0, maxWaitDeadline - Date.now());
      if (remainingForNetwork > 0) {
        await this.waitForNetworkStability(remainingForNetwork);
      }
      const remainingForVisual = Math.max(0, maxWaitDeadline - Date.now());
      if (remainingForVisual > 0) {
        await this.waitForVisualStability(remainingForVisual);
      }
      const now = Date.now();
      if (now < minWaitDeadline) {
        const remainingMinWait = minWaitDeadline - now;
        this.log(`Waiting additional ${remainingMinWait}ms to meet minimum wait time`);
        await new Promise((resolve) => setTimeout(resolve, remainingMinWait));
      }
      const totalTime = Date.now() - startTime;
      this.log(`Page stability wait completed in ${totalTime}ms`);
    } catch (e) {
      this.log(`Error during stability wait: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}

function parseTypeContent(content) {
  const regex = /<enter>|<tab>/g;
  const result = [];
  let lastIndex = 0;
  content.replace(regex, (match, offset) => {
    const text = content.slice(lastIndex, offset).trim();
    if (text) result.push(text);
    result.push(match);
    lastIndex = offset + match.length;
    return match;
  });
  const remaining = content.slice(lastIndex).trim();
  if (remaining) result.push(remaining);
  return result;
}
function renderMinimalAccessibilityTree(node) {
  const sanitize = (text) => {
    return String(text).trim().replace(/\n/g, "\\n");
  };
  function recursiveFlatten(node2, indent) {
    const isTextLike = (n) => n && (n.role === "StaticText" || n.role === "text") && n.name && n.name.trim();
    let childrenOutput = "";
    if (node2.children) {
      const newChildren = [];
      let currentTextBuffer = [];
      for (const child of node2.children) {
        if (isTextLike(child)) {
          currentTextBuffer.push(sanitize(child.name));
        } else {
          if (currentTextBuffer.length > 0) {
            newChildren.push({ role: "coalesced-text", name: currentTextBuffer.join(" ") });
            currentTextBuffer = [];
          }
          newChildren.push(child);
        }
      }
      if (currentTextBuffer.length > 0) {
        newChildren.push({ role: "coalesced-text", name: currentTextBuffer.join(" ") });
      }
      for (const child of newChildren) {
        if (child.role === "coalesced-text") {
          childrenOutput += `${indent}  ${child.name}
`;
        } else {
          childrenOutput += recursiveFlatten(child, indent + "  ");
        }
      }
    }
    const isBoringContainer = (node2.role === "generic" || node2.role === "div") && !node2.name;
    if (isBoringContainer) {
      return childrenOutput;
    }
    let line = "";
    if (node2.role && !["StaticText", "text", "RootWebArea"].includes(node2.role)) {
      line = `${indent}[${node2.role}]`;
      if (node2.name && sanitize(node2.name)) {
        line += ` ${sanitize(node2.name)}`;
      }
      if (node2.value !== void 0 && sanitize(node2.value)) {
        line += ` (value: ${sanitize(node2.value)})`;
      }
      if (node2.checked !== void 0) line += ` (checked: ${node2.checked})`;
      if (node2.disabled) line += ` (disabled)`;
      line += "\n";
    }
    return line + childrenOutput;
  }
  const rawFlattened = recursiveFlatten(node, "");
  return rawFlattened.split("\n").filter((line) => line.trim() !== "").join("\n");
}

class ActionVisualizer {
  /**
   * Manages the visual indicator for actions on a page
   */
  page;
  visualElementId = "action-visual-indicator";
  lastPosition = null;
  constructor() {
  }
  setActivePage(page) {
    this.page = page;
    page.on("load", async () => {
      try {
        await this.redrawLastPosition();
      } catch (error) {
      }
    });
  }
  async visualizeAction(x, y) {
    this.lastPosition = { x, y };
    await this._drawVisual(x, y, true);
    await this.page.waitForTimeout(300);
  }
  async redrawLastPosition() {
    if (this.lastPosition) {
      await this._drawVisual(this.lastPosition.x, this.lastPosition.y, false);
    }
  }
  // Internal method to handle the actual drawing logic
  async _drawVisual(x, y, showClickEffect) {
    try {
      await this.page.evaluate(
        ({ x: x2, y: y2, id, showClickEffect: showClickEffect2 }) => {
          const docX = x2 + window.scrollX;
          const docY = y2 + window.scrollY;
          if (showClickEffect2) {
            const circle = document.createElement("div");
            circle.style.position = "absolute";
            circle.style.left = `${docX}px`;
            circle.style.top = `${docY}px`;
            circle.style.borderRadius = "50%";
            circle.style.backgroundColor = "#026aa1";
            circle.style.width = "0px";
            circle.style.height = "0px";
            circle.style.transform = "translate(-50%, -50%)";
            circle.style.pointerEvents = "none";
            circle.style.zIndex = "9998";
            circle.style.opacity = "0.7";
            document.body.appendChild(circle);
            const animation = circle.animate([
              { width: "0px", height: "0px", opacity: 0.7 },
              // Start state
              { width: "50px", height: "50px", opacity: 0 }
              // End state
            ], {
              duration: 500,
              // 500ms duration
              easing: "ease-out"
            });
            animation.onfinish = () => {
              circle.remove();
            };
          }
          let pointerElement = document.getElementById(id);
          if (!pointerElement) {
            pointerElement = document.createElement("div");
            pointerElement.id = id;
            pointerElement.style.position = "absolute";
            pointerElement.style.zIndex = "9999";
            pointerElement.style.pointerEvents = "none";
            pointerElement.style.transition = "left 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";
            pointerElement.innerHTML = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="32"
   height="32"
   viewBox="0 0 113.50408 99.837555"
   version="1.1"
   id="svg1"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs1" />
  <g
     id="layer1"
     transform="translate(-413.10686,-501.19661)">
    <path
       style="fill:#026aa1;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-dasharray:none;stroke-opacity:1"
       d="m 416.1069,504.1966 52.47697,93.83813 8.33253,-57.61019 z"
       id="path14-1" />
    <path
       style="fill:#0384c7;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-dasharray:none;stroke-opacity:1"
       d="m 416.1069,504.1966 60.8095,36.22794 46.69517,-34.75524 z"
       id="path15-8" />
    <path
       style="fill:#0384c7;fill-opacity:0;stroke:#000000;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
       d="m 416.1069,504.19658 52.47698,93.83813 8.33252,-57.61019 46.69517,-34.75521 -107.50467,-1.47273"
       id="path16" />
  </g>
</svg>`;
            document.body.appendChild(pointerElement);
          }
          pointerElement.style.left = `${docX}px`;
          pointerElement.style.top = `${docY}px`;
          pointerElement.style.transform = "translate(-1px, -3px)";
        },
        { x, y, id: this.visualElementId, showClickEffect }
      );
    } catch (error) {
      logger.trace(`Failed to draw visual: ${error.message}`);
    }
  }
  // async removeActionVisuals(): Promise<void> {
  //     // Remove the visual indicator
  //     await this.page.evaluate((id) => {
  //         const element = document.getElementById(id);
  //         if (element) {
  //             element.remove();
  //         }
  //     }, this.visualElementId);
  // }
}

class TabManager {
  /**
   * Page / tab manager
   */
  //private state!: TabState;
  context;
  activePage;
  // the page the agent currently sees and acts on
  events;
  constructor(context) {
    this.context = context;
    this.events = new EventEmitter();
    this.context.on("page", this.onPageCreated.bind(this));
  }
  async onPageCreated(page) {
    this.setActivePage(page);
  }
  setActivePage(page) {
    this.activePage = page;
    this.events.emit("tabChanged", page);
  }
  async switchTab(index) {
    const pages = this.context.pages();
    if (index < 0 || index >= pages.length) {
      throw new Error(`Invalid tab index: ${index}`);
    }
    const page = pages[index];
    await page.bringToFront();
    this.setActivePage(page);
  }
  getActivePage() {
    return this.activePage;
  }
  getPages() {
    return this.context.pages();
  }
  async retrieveState() {
    let activeIndex = -1;
    let tabs = [];
    for (const [i, page] of this.context.pages().entries()) {
      if (page == this.activePage) {
        activeIndex = i;
      }
      let title;
      try {
        title = await page.title();
      } catch {
        logger.warn("Could not load page title while retrieving tab state");
        title = "(could not load title)";
      }
      const url = page.url();
      tabs.push({ title, url });
    }
    return {
      activeTab: activeIndex,
      tabs
    };
  }
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var shadowDOMInputAdapter;
var hasRequiredShadowDOMInputAdapter;

function requireShadowDOMInputAdapter () {
	if (hasRequiredShadowDOMInputAdapter) return shadowDOMInputAdapter;
	hasRequiredShadowDOMInputAdapter = 1;
	shadowDOMInputAdapter = function getShadowDOMInputAdapterScript() {
	  return function() {
	    if (typeof window.magnitudeShadowDOMAdapter !== "undefined") {
	      console.warn("magnitudeShadowDOMAdapter already defined. Cleaning up old one.");
	      if (typeof window.magnitudeShadowDOMAdapter.cleanup === "function") {
	        window.magnitudeShadowDOMAdapter.cleanup();
	      }
	    }
	    window.magnitudeShadowDOMAdapter = {
	      activePopup: null,
	      // Generic reference to the currently open popup/dropdown
	      activePopupType: null,
	      // 'select', 'date', 'color'
	      activePopupOriginalElement: null,
	      // The element that triggered the popup
	      boundHandleDocumentMousedown: null,
	      boundHandleDocumentClick: null,
	      // For click event prevention
	      boundHandleOutsidePopupClick: null,
	      boundHandleDocumentKeydown: null,
	      // For select typeahead
	      searchString: "",
	      // For select typeahead
	      searchTimeoutId: null,
	      // For select typeahead
	      // --- Initialization and Cleanup ---
	      init: function() {
	        this.boundHandleDocumentMousedown = this.handleDocumentMousedown.bind(this);
	        document.addEventListener("mousedown", this.boundHandleDocumentMousedown, true);
	        this.boundHandleDocumentClick = this.handleDocumentClick.bind(this);
	        document.addEventListener("click", this.boundHandleDocumentClick, true);
	        this.boundHandleDocumentKeydown = this.handleDocumentKeydown.bind(this);
	        console.log("Shadow DOM Input Adapter mousedown, click, and keydown listeners prepared.");
	      },
	      cleanup: function() {
	        this.closeActivePopup();
	        if (this.boundHandleDocumentMousedown) {
	          document.removeEventListener("mousedown", this.boundHandleDocumentMousedown, true);
	          this.boundHandleDocumentMousedown = null;
	        }
	        if (this.boundHandleDocumentClick) {
	          document.removeEventListener("click", this.boundHandleDocumentClick, true);
	          this.boundHandleDocumentClick = null;
	        }
	        if (this.boundHandleDocumentKeydown && this.activePopupType !== "select") {
	          document.removeEventListener("keydown", this.boundHandleDocumentKeydown, true);
	        }
	        console.log("Shadow DOM Input Adapter cleaned up.");
	      },
	      // --- Main Mousedown & Click Handlers ---
	      handleDocumentMousedown: function(e) {
	        const target = e.target;
	        if (!target || typeof target.tagName !== "string") return;
	        if (this.activePopup && this.activePopup.contains(target)) {
	          return;
	        }
	        if (target.tagName === "SELECT" || target.tagName === "OPTION" && target.parentElement && target.parentElement.tagName === "SELECT") {
	          this.handleSelectInteraction(target.tagName === "SELECT" ? target : target.parentElement, e);
	        } else if (target.tagName === "INPUT" && target.type === "date") {
	          this.handleDateInputInteraction(target, e);
	        } else if (target.tagName === "INPUT" && target.type === "color") {
	          this.handleColorInputInteraction(target, e);
	        }
	      },
	      handleDocumentClick: function(e) {
	        const target = e.target;
	        if (!target || typeof target.tagName !== "string") return;
	        if (target.tagName === "INPUT" && (target.type === "date" || target.type === "color") || target.tagName === "SELECT" || target.tagName === "OPTION" && target.parentElement && target.parentElement.tagName === "SELECT") {
	          if (this.activePopup && this.activePopup.contains(target)) {
	            return;
	          }
	          e.preventDefault();
	          e.stopPropagation();
	        }
	      },
	      // --- Generic Popup Management ---
	      closeActivePopup: function() {
	        if (this.activePopup) {
	          this.activePopup.remove();
	          this.activePopup = null;
	        }
	        this.activePopupType = null;
	        this.activePopupOriginalElement = null;
	        if (this.boundHandleOutsidePopupClick) {
	          document.removeEventListener("mousedown", this.boundHandleOutsidePopupClick, true);
	          this.boundHandleOutsidePopupClick = null;
	        }
	        if (this.activePopupType === "select" && this.boundHandleDocumentKeydown) {
	          document.removeEventListener("keydown", this.boundHandleDocumentKeydown, true);
	        }
	        clearTimeout(this.searchTimeoutId);
	        this.searchString = "";
	        this.searchTimeoutId = null;
	      },
	      _setupOutsideClickListener: function() {
	        setTimeout(() => {
	          this.boundHandleOutsidePopupClick = (event) => {
	            if (this.activePopup && !this.activePopup.contains(event.target) && event.target !== this.activePopupOriginalElement && (!this.activePopupOriginalElement || !this.activePopupOriginalElement.contains(event.target))) {
	              this.closeActivePopup();
	            }
	          };
	          document.addEventListener("mousedown", this.boundHandleOutsidePopupClick, true);
	        }, 0);
	      },
	      _createPopupElement: function(originalElement, type) {
	        const rect = originalElement.getBoundingClientRect();
	        const popup = document.createElement("div");
	        popup.dataset.popupType = type;
	        this._setStyles(popup, {
	          position: "fixed",
	          left: `${rect.left}px`,
	          top: `${rect.bottom + 2}px`,
	          minWidth: `${rect.width}px`,
	          background: "white",
	          border: "1px solid #ccc",
	          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
	          zIndex: "2147483647",
	          padding: "10px",
	          borderRadius: "4px",
	          display: "flex",
	          flexDirection: "column",
	          gap: "5px"
	        });
	        return popup;
	      },
	      _updateInputValidationIndicator: function(inputElementContainer, isValid) {
	        let indicatorSpan = inputElementContainer.querySelector(".validation-indicator");
	        if (!indicatorSpan) {
	          indicatorSpan = document.createElement("span");
	          indicatorSpan.className = "validation-indicator";
	          this._setStyles(indicatorSpan, {
	            marginLeft: "5px",
	            display: "inline-flex",
	            alignItems: "center",
	            width: "16px",
	            // Fixed width for the indicator
	            height: "16px",
	            // Fixed height
	            justifyContent: "center"
	          });
	          inputElementContainer.appendChild(indicatorSpan);
	        }
	        if (isValid === true) {
	          indicatorSpan.textContent = "\u2714";
	          indicatorSpan.style.color = "green";
	        } else if (isValid === false) {
	          indicatorSpan.textContent = "\u2716";
	          indicatorSpan.style.color = "red";
	        } else {
	          indicatorSpan.textContent = "";
	        }
	      },
	      // --- SELECT Element Specific Logic ---
	      handleSelectInteraction: function(selectElement, event) {
	        event.preventDefault();
	        event.stopPropagation();
	        if (this.activePopupType === "select" && this.activePopupOriginalElement === selectElement) {
	          this.closeActivePopup();
	          return;
	        }
	        this.closeActivePopup();
	        this.createAndShowSelectDropdown(selectElement);
	      },
	      createAndShowSelectDropdown: function(select) {
	        const dropdown = this._createPopupElement(select, "select");
	        this._setStyles(dropdown, {
	          padding: "0",
	          maxHeight: `${Math.min(300, window.innerHeight - select.getBoundingClientRect().bottom - 20)}px`,
	          overflowY: "auto",
	          gap: "0"
	          // Select doesn't need the main popup gap
	        });
	        const contentWrapper = document.createElement("div");
	        this._setStyles(contentWrapper, { padding: "5px 0" });
	        Array.from(select.options).forEach((option, index) => {
	          const div = document.createElement("div");
	          div.textContent = option.text;
	          this._setStyles(div, {
	            padding: "8px 12px",
	            margin: "0",
	            cursor: "pointer",
	            backgroundColor: index === select.selectedIndex ? "#e0e0e0" : "white",
	            whiteSpace: "nowrap",
	            overflow: "hidden",
	            textOverflow: "ellipsis"
	          });
	          div.setAttribute("data-index", index.toString());
	          div.onmouseenter = function() {
	            this.style.backgroundColor = index === select.selectedIndex ? "#d0d0d0" : "#f0f0f0";
	          };
	          div.onmouseleave = function() {
	            this.style.backgroundColor = index === select.selectedIndex ? "#e0e0e0" : "white";
	          };
	          div.onclick = () => {
	            select.selectedIndex = index;
	            select.dispatchEvent(new Event("input", { bubbles: true }));
	            select.dispatchEvent(new Event("change", { bubbles: true }));
	            this.closeActivePopup();
	          };
	          contentWrapper.appendChild(div);
	        });
	        dropdown.appendChild(contentWrapper);
	        const rootNode = select.getRootNode() instanceof ShadowRoot ? select.getRootNode() : document.body;
	        rootNode.appendChild(dropdown);
	        this.activePopup = dropdown;
	        this.activePopupType = "select";
	        this.activePopupOriginalElement = select;
	        select.blur();
	        this._setupOutsideClickListener();
	        this.searchString = "";
	        clearTimeout(this.searchTimeoutId);
	        document.addEventListener("keydown", this.boundHandleDocumentKeydown, true);
	        console.log("Custom select dropdown created for:", select.id || select.name);
	      },
	      // --- Keydown Handler for Select Typeahead ---
	      handleDocumentKeydown: function(e) {
	        if (!this.activePopup || this.activePopupType !== "select" || !this.activePopupOriginalElement) {
	          return;
	        }
	        if (e.metaKey || e.ctrlKey || e.altKey || [
	          "Shift",
	          "Control",
	          "Alt",
	          "Meta",
	          "Escape",
	          "Tab",
	          "ArrowUp",
	          "ArrowDown",
	          "ArrowLeft",
	          "ArrowRight",
	          "Home",
	          "End",
	          "PageUp",
	          "PageDown"
	        ].includes(e.key)) {
	          if (e.key === "Escape") {
	            this.closeActivePopup();
	          }
	          return;
	        }
	        if (e.key === "Enter") {
	          e.preventDefault();
	          e.stopImmediatePropagation();
	          const options2 = Array.from(this.activePopup.querySelectorAll("[data-index]"));
	          const highlightedOption = options2.find((opt) => opt.style.backgroundColor === "rgb(173, 216, 230)");
	          if (highlightedOption) {
	            const index = parseInt(highlightedOption.getAttribute("data-index"));
	            const select = this.activePopupOriginalElement;
	            select.selectedIndex = index;
	            select.dispatchEvent(new Event("input", { bubbles: true }));
	            select.dispatchEvent(new Event("change", { bubbles: true }));
	            this.closeActivePopup();
	          }
	          return;
	        }
	        if (e.key.length === 1) {
	          e.preventDefault();
	          e.stopPropagation();
	        }
	        clearTimeout(this.searchTimeoutId);
	        this.searchString += e.key.toLowerCase();
	        this.searchTimeoutId = setTimeout(() => {
	          this.searchString = "";
	        }, 800);
	        const options = Array.from(this.activePopup.querySelectorAll("[data-index]"));
	        let matchedOption = null;
	        for (const optionElement of options) {
	          if (optionElement.textContent.toLowerCase().startsWith(this.searchString)) {
	            matchedOption = optionElement;
	            break;
	          }
	        }
	        if (matchedOption) {
	          options.forEach((opt) => {
	            const optIndex = parseInt(opt.getAttribute("data-index"));
	            const originalSelect = this.activePopupOriginalElement;
	            opt.style.backgroundColor = optIndex === originalSelect.selectedIndex ? "#e0e0e0" : "white";
	            opt.onmouseenter = function() {
	              this.style.backgroundColor = optIndex === originalSelect.selectedIndex ? "#d0d0d0" : "#f0f0f0";
	            };
	            opt.onmouseleave = function() {
	              this.style.backgroundColor = optIndex === originalSelect.selectedIndex ? "#e0e0e0" : "white";
	            };
	          });
	          matchedOption.style.backgroundColor = "#add8e6";
	          matchedOption.onmouseenter = function() {
	            this.style.backgroundColor = "#add8e6";
	          };
	          matchedOption.scrollIntoView({ block: "nearest" });
	        }
	      },
	      // --- DATE Input Specific Logic ---
	      handleDateInputInteraction: function(dateInputElement, event) {
	        event.preventDefault();
	        event.stopPropagation();
	        if (this.activePopupType === "date" && this.activePopupOriginalElement === dateInputElement) {
	          this.closeActivePopup();
	          return;
	        }
	        this.closeActivePopup();
	        this.createAndShowDatePopup(dateInputElement);
	      },
	      createAndShowDatePopup: function(originalDateInput) {
	        const popup = this._createPopupElement(originalDateInput, "date");
	        this._setStyles(popup, { flexDirection: "row", alignItems: "center", gap: "0" });
	        const textInput = document.createElement("input");
	        textInput.type = "text";
	        textInput.placeholder = "MM/DD/YYYY";
	        this._setStyles(textInput, { flexGrow: "1", padding: "8px", border: "1px solid #ccc", borderRadius: "3px" });
	        if (originalDateInput.value) {
	          const parts = originalDateInput.value.split("-");
	          if (parts.length === 3) textInput.value = `${parts[1]}/${parts[2]}/${parts[0]}`;
	          else textInput.value = originalDateInput.value;
	        }
	        popup.appendChild(textInput);
	        this._updateInputValidationIndicator(popup, null);
	        const self = this;
	        textInput.addEventListener("input", function() {
	          const inputValue = this.value;
	          if (!inputValue) {
	            self._updateInputValidationIndicator(popup, null);
	            return;
	          }
	          const dateParts = inputValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	          if (dateParts) {
	            const month = parseInt(dateParts[1], 10);
	            const day = parseInt(dateParts[2], 10);
	            const year = parseInt(dateParts[3], 10);
	            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
	              self._updateInputValidationIndicator(popup, true);
	              originalDateInput.value = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
	              originalDateInput.dispatchEvent(new Event("input", { bubbles: true }));
	              originalDateInput.dispatchEvent(new Event("change", { bubbles: true }));
	            } else {
	              self._updateInputValidationIndicator(popup, false);
	            }
	          } else {
	            self._updateInputValidationIndicator(popup, false);
	          }
	        });
	        textInput.addEventListener("keydown", function(e) {
	          if (e.key === "Enter") {
	            e.preventDefault();
	            const inputValue = this.value;
	            const dateParts = inputValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	            if (dateParts) {
	              const month = parseInt(dateParts[1], 10);
	              const day = parseInt(dateParts[2], 10);
	              parseInt(dateParts[3], 10);
	              if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
	                self.closeActivePopup();
	              }
	            }
	          }
	        });
	        const rootNode = originalDateInput.getRootNode() instanceof ShadowRoot ? originalDateInput.getRootNode() : document.body;
	        rootNode.appendChild(popup);
	        this.activePopup = popup;
	        this.activePopupType = "date";
	        this.activePopupOriginalElement = originalDateInput;
	        originalDateInput.blur();
	        this._setupOutsideClickListener();
	        setTimeout(() => {
	          textInput.focus();
	          textInput.select();
	        }, 0);
	        console.log("Custom date popup created for:", originalDateInput.id || originalDateInput.name);
	      },
	      // --- COLOR Input Specific Logic ---
	      handleColorInputInteraction: function(colorInputElement, event) {
	        event.preventDefault();
	        event.stopPropagation();
	        if (this.activePopupType === "color" && this.activePopupOriginalElement === colorInputElement) {
	          this.closeActivePopup();
	          return;
	        }
	        this.closeActivePopup();
	        this.createAndShowColorPopup(colorInputElement);
	      },
	      createAndShowColorPopup: function(originalColorInput) {
	        const popup = this._createPopupElement(originalColorInput, "color");
	        this._setStyles(popup, { flexDirection: "row", alignItems: "center", gap: "0" });
	        const textInput = document.createElement("input");
	        textInput.type = "text";
	        textInput.placeholder = "#RRGGBB";
	        this._setStyles(textInput, { flexGrow: "1", padding: "8px", border: "1px solid #ccc", borderRadius: "3px", marginRight: "5px" });
	        if (originalColorInput.value) textInput.value = originalColorInput.value;
	        const previewSpan = document.createElement("span");
	        this._setStyles(previewSpan, {
	          width: "28px",
	          height: "28px",
	          display: "inline-block",
	          border: "1px solid #ccc",
	          backgroundColor: originalColorInput.value || "#ffffff",
	          borderRadius: "3px",
	          flexShrink: "0",
	          marginRight: "5px"
	          // Space before validation indicator
	        });
	        popup.appendChild(textInput);
	        popup.appendChild(previewSpan);
	        this._updateInputValidationIndicator(popup, null);
	        const self = this;
	        textInput.addEventListener("input", function() {
	          const inputValue = this.value.trim();
	          if (!inputValue) {
	            self._updateInputValidationIndicator(popup, null);
	            previewSpan.style.backgroundColor = "#ffffff";
	            return;
	          }
	          let finalColor = "";
	          if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(inputValue)) {
	            finalColor = inputValue;
	          } else if (/^[0-9A-Fa-f]{6}$/.test(inputValue) || /^[0-9A-Fa-f]{3}$/.test(inputValue)) {
	            finalColor = "#" + inputValue;
	          }
	          if (finalColor) {
	            previewSpan.style.backgroundColor = finalColor;
	            self._updateInputValidationIndicator(popup, true);
	            originalColorInput.value = finalColor;
	            originalColorInput.dispatchEvent(new Event("input", { bubbles: true }));
	            originalColorInput.dispatchEvent(new Event("change", { bubbles: true }));
	          } else {
	            previewSpan.style.backgroundColor = "#ffffff";
	            self._updateInputValidationIndicator(popup, false);
	          }
	        });
	        if (textInput.value) textInput.dispatchEvent(new Event("input"));
	        textInput.addEventListener("keydown", function(e) {
	          if (e.key === "Enter") {
	            e.preventDefault();
	            const inputValue = this.value.trim();
	            let finalColor = "";
	            if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(inputValue)) {
	              finalColor = inputValue;
	            } else if (/^[0-9A-Fa-f]{6}$/.test(inputValue) || /^[0-9A-Fa-f]{3}$/.test(inputValue)) {
	              finalColor = "#" + inputValue;
	            }
	            if (finalColor) {
	              self.closeActivePopup();
	            }
	          }
	        });
	        const rootNode = originalColorInput.getRootNode() instanceof ShadowRoot ? originalColorInput.getRootNode() : document.body;
	        rootNode.appendChild(popup);
	        this.activePopup = popup;
	        this.activePopupType = "color";
	        this.activePopupOriginalElement = originalColorInput;
	        originalColorInput.blur();
	        this._setupOutsideClickListener();
	        setTimeout(() => {
	          textInput.focus();
	          textInput.select();
	        }, 0);
	        console.log("Custom color popup created for:", originalColorInput.id || originalColorInput.name);
	      },
	      // --- Helper Functions ---
	      _setStyles: function(element, styles) {
	        for (const property in styles) {
	          element.style[property] = styles[property];
	        }
	      }
	      // _copyAttributes is not used in this version as we are not replacing elements.
	    };
	    window.magnitudeShadowDOMAdapter.init();
	  }.toString();
	};
	return shadowDOMInputAdapter;
}

var shadowDOMInputAdapterExports = requireShadowDOMInputAdapter();
var getShadowDOMInputAdapterScript = /*@__PURE__*/getDefaultExportFromCjs(shadowDOMInputAdapterExports);

class DOMTransformer {
  initializedPages = /* @__PURE__ */ new WeakSet();
  // Track pages for which 'load' listener is set
  constructor() {
  }
  setActivePage(newPage) {
    if (!this.initializedPages.has(newPage)) {
      newPage.on("load", async () => {
        await this.setupScriptForPage(newPage);
      });
      this.initializedPages.add(newPage);
    }
  }
  async setupScriptForPage(targetPage) {
    try {
      const scriptAlreadyInjected = await targetPage.evaluate(() => {
        return window.__magnitudeShadowDOMAdapterInjected === true;
      }).catch(() => false);
      if (scriptAlreadyInjected) {
        logger.trace("Select manager script already present on this page load.");
        return;
      }
      const scriptFnString = getShadowDOMInputAdapterScript();
      await targetPage.evaluate(`
                (${scriptFnString})();
                window.__magnitudeShadowDOMAdapterInjected = true;
            `);
      logger.trace(`Script injected into page: ${targetPage.url()}`);
    } catch (error) {
      const url = targetPage.isClosed() ? "[closed page]" : targetPage.url();
      logger.warn(`Error injecting script into ${url}: ${error.message}`);
    }
  }
}

class WebHarness {
  // implements StateComponent
  /**
   * Executes web actions on a page
   * Not responsible for browser lifecycle
   */
  context;
  options;
  stability;
  visualizer;
  transformer;
  tabs;
  constructor(context, options = {}) {
    this.context = context;
    this.options = options;
    this.stability = new PageStabilityAnalyzer();
    this.visualizer = new ActionVisualizer();
    this.transformer = new DOMTransformer();
    this.tabs = new TabManager(context);
    this.tabs.events.on("tabChanged", async (page) => {
      this.stability.setActivePage(page);
      this.visualizer.setActivePage(page);
      this.transformer.setActivePage(page);
    });
  }
  async retrieveTabState() {
    return this.tabs.retrieveState();
  }
  // setActivePage(page: Page) {
  //     this.page = page;
  //     this.stability.setActivePage(this.page);
  //     this.visualizer.setActivePage(this.page);
  // }
  async start() {
    await this.context.newPage();
  }
  get page() {
    return this.tabs.getActivePage();
  }
  async screenshot(options = {}) {
    const dpr = await this.page.evaluate(() => window.devicePixelRatio);
    const buffer = await this.page.screenshot({ type: "png", ...options });
    const base64data = buffer.toString("base64");
    const image = Image.fromBase64(base64data);
    const { width, height } = await image.getDimensions();
    const rescaledImage = await image.resize(width / dpr, height / dpr);
    return rescaledImage;
  }
  // async goto(url: string) {
  //     // No need to redraw here anymore, the 'load' event listener handles it
  //     await this.page.goto(url);
  // }
  async _type(content) {
    const chunks = parseTypeContent(content);
    const totalTextDelay = 500;
    let totalTextLength = 0;
    for (const chunk of chunks) {
      if (chunk != "<enter>" && chunk != "<tab>") {
        totalTextLength += chunk.length;
      }
    }
    for (const chunk of chunks) {
      if (chunk == "<enter>") {
        await this.page.keyboard.press("Enter");
      } else if (chunk == "<tab>") {
        await this.page.keyboard.press("Tab");
      } else {
        const chunkProportion = chunk.length / totalTextLength;
        const chunkDelay = totalTextDelay * chunkProportion;
        const chunkCharDelay = chunkDelay / chunk.length;
        await this.page.keyboard.type(chunk, { delay: chunkCharDelay });
      }
    }
  }
  // safer might be Coordinate interface/obj tied to certain screen space dims
  transformCoordinates({ x, y }) {
    const virtual = this.options.virtualScreenDimensions;
    if (!virtual) {
      return { x, y };
    }
    const vp = this.page.viewportSize();
    if (!vp) throw new Error("Could not get viewport dimensions to transform coordinates");
    return {
      x: x * (vp.width / virtual.width),
      y: y * (vp.height / virtual.height)
    };
  }
  async click({ x, y }) {
    ({ x, y } = this.transformCoordinates({ x, y }));
    await this.visualizer.visualizeAction(x, y);
    await this.page.mouse.click(x, y);
    await this.waitForStability();
  }
  async rightClick({ x, y }) {
    ({ x, y } = this.transformCoordinates({ x, y }));
    await this.visualizer.visualizeAction(x, y);
    await this.page.mouse.click(x, y, { button: "right" });
    await this.waitForStability();
  }
  async doubleClick({ x, y }) {
    ({ x, y } = this.transformCoordinates({ x, y }));
    await this.visualizer.visualizeAction(x, y);
    await this.page.mouse.dblclick(x, y);
    await this.waitForStability();
  }
  async drag({ x1, y1, x2, y2 }) {
    ({ x: x1, y: y1 } = this.transformCoordinates({ x: x1, y: y1 }));
    ({ x: x2, y: y2 } = this.transformCoordinates({ x: x2, y: y2 }));
    await this.page.mouse.move(x1, y1, { steps: 1 });
    await this.page.mouse.down();
    await this.visualizer.visualizeAction(x1, y1);
    await this.page.waitForTimeout(500);
    await Promise.all([
      this.page.mouse.move(x2, y2, { steps: 20 }),
      this.visualizer.visualizeAction(x2, y2)
    ]);
    await this.page.mouse.up();
    await this.waitForStability();
  }
  async type({ content }) {
    await this._type(content);
    await this.waitForStability();
  }
  async clickAndType({ x, y, content }) {
    ({ x, y } = this.transformCoordinates({ x, y }));
    await this.visualizer.visualizeAction(x, y);
    await this.page.mouse.click(x, y);
    await this._type(content);
    await this.waitForStability();
  }
  async scroll({ x, y, deltaX, deltaY }) {
    ({ x, y } = this.transformCoordinates({ x, y }));
    await this.visualizer.visualizeAction(x, y);
    await this.page.mouse.move(x, y);
    await this.page.mouse.wheel(deltaX, deltaY);
    await this.waitForStability();
  }
  async switchTab({ index }) {
    await this.tabs.switchTab(index);
    await this.waitForStability();
  }
  async newTab() {
    await this.context.newPage();
    await this.navigate("https://google.com");
  }
  async navigate(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.waitForStability();
  }
  async selectAll() {
    await this.page.keyboard.down("ControlOrMeta");
    await this.page.keyboard.press("KeyA");
    await this.page.keyboard.up("ControlOrMeta");
  }
  async enter() {
    await this.page.keyboard.press("Enter");
  }
  async backspace() {
    await this.page.keyboard.press("Backspace");
  }
  async tab() {
    await this.page.keyboard.press("Tab");
  }
  async goBack() {
    await this.page.goBack();
  }
  async executeAction(action) {
    if (action.variant === "click") {
      await this.click(action);
    } else if (action.variant === "type") {
      await this.clickAndType(action);
    } else if (action.variant === "scroll") {
      await this.scroll(action);
    } else if (action.variant === "tab") {
      await this.switchTab(action);
    } else {
      throw Error(`Unhandled web action variant: ${action.variant}`);
    }
  }
  async waitForStability(timeout) {
    await this.stability.waitForStability(timeout);
  }
  // async applyTransformations() {
  //     const start = Date.now();
  //     await this.transformer.applyTransformations();
  //     logger.trace(`DOM transformations took ${Date.now() - start}ms`);
  // }
  // async waitForStability(timeout?: number): Promise<void> {
  //     await this.stability.waitForStability(timeout);
  // }
}

const clickTargetAction = createAction({
  name: "mouse:click",
  description: "Click something",
  schema: z.z.object({
    target: z.z.string().describe("Where exactly to click")
  }),
  resolver: async ({ input: { target }, agent }) => {
    const web = agent.require(BrowserConnector);
    const harness = web.getHarness();
    const screenshot = await web.getLastScreenshot();
    const { x, y } = await web.requireGrounding().locateTarget(screenshot, target);
    await harness.click({ x, y });
  }
  //render: ({ x, y}) => `⊙ Clicked (${})`
});
const scrollTargetAction = createAction({
  name: "mouse:scroll",
  description: "Hover mouse over target and scroll",
  schema: z.z.object({
    target: z.z.string().describe("Somewhere specific inside the container to scroll in"),
    deltaX: z.z.number().int().describe("Pixels to scroll horizontally"),
    deltaY: z.z.number().int().describe("Pixels to scroll vertically")
  }),
  resolver: async ({ input: { target, deltaX, deltaY }, agent }) => {
    const web = agent.require(BrowserConnector);
    const harness = web.getHarness();
    const screenshot = await web.getLastScreenshot();
    const { x, y } = await web.requireGrounding().locateTarget(screenshot, target);
    await harness.scroll({ x, y, deltaX, deltaY });
  }
});
const clickCoordAction = createAction({
  name: "mouse:click",
  description: "Click something",
  schema: z.z.object({
    x: z.z.number().int(),
    y: z.z.number().int()
  }),
  resolver: async ({ input: { x, y }, agent }) => {
    const web = agent.require(BrowserConnector);
    const harness = web.getHarness();
    await harness.click({ x, y });
  },
  render: ({ x, y }) => `\u2299 click (${x}, ${y})`
});
const mouseDoubleClickAction = createAction({
  name: "mouse:double_click",
  schema: z.z.object({
    x: z.z.number().int(),
    y: z.z.number().int()
  }),
  resolver: async ({ input: { x, y }, agent }) => {
    const web = agent.require(BrowserConnector);
    const harness = web.getHarness();
    await harness.doubleClick({ x, y });
  },
  render: ({ x, y }) => `\u2299 double click (${x}, ${y})`
});
const mouseRightClickAction = createAction({
  name: "mouse:right_click",
  schema: z.z.object({
    x: z.z.number().int(),
    y: z.z.number().int()
  }),
  resolver: async ({ input: { x, y }, agent }) => {
    await agent.require(BrowserConnector).getHarness().rightClick({ x, y });
  },
  render: ({ x, y }) => `\u2299 right click (${x}, ${y})`
});
const mouseDragAction = createAction({
  name: "mouse:drag",
  description: "Click and hold mouse in one location and release in another",
  schema: z.z.object({
    from: z.z.object({ x: z.z.number().int(), y: z.z.number().int() }),
    to: z.z.object({ x: z.z.number().int(), y: z.z.number().int() })
  }),
  resolver: async ({ input: { from, to }, agent }) => {
    const web = agent.require(BrowserConnector);
    const harness = web.getHarness();
    await harness.drag({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
  },
  render: ({ from, to }) => `\u2921 drag (${from.x}, ${from.y}) -> (${to.x}, ${to.y})`
});
const typeAction = createAction({
  name: "keyboard:type",
  description: "Make sure to click where you need to type first",
  // make sure you click into it first
  schema: z.z.object({
    content: z.z.string().describe("Content to type")
  }),
  resolver: async ({ input: { content }, agent }) => {
    const webConnector = agent.require(BrowserConnector);
    const harness = webConnector.getHarness();
    await harness.type({ content });
  },
  render: ({ content }) => `\u2328\uFE0E type "${content}"`
});
const keyboardEnterAction = createAction({
  name: "keyboard:enter",
  resolver: async ({ agent }) => {
    await agent.require(BrowserConnector).getHarness().enter();
  },
  render: () => `\u23CE press enter`
});
const keyboardTabAction = createAction({
  name: "keyboard:tab",
  resolver: async ({ agent }) => {
    await agent.require(BrowserConnector).getHarness().tab();
  },
  render: () => `\u21E5 press tab`
});
const keyboardBackspaceAction = createAction({
  name: "keyboard:backspace",
  resolver: async ({ agent }) => {
    await agent.require(BrowserConnector).getHarness().backspace();
  },
  render: () => `\u232B press backspace`
});
const keyboardSelectAllAction = createAction({
  name: "keyboard:select_all",
  description: "Select all content in the active text area (CTRL+A)",
  resolver: async ({ input: { content }, agent }) => {
    await agent.require(BrowserConnector).getHarness().selectAll();
  },
  render: () => `\u2B1A select all`
});
const scrollCoordAction = createAction({
  name: "mouse:scroll",
  description: "Hover mouse over target and scroll",
  schema: z.z.object({
    x: z.z.number().int(),
    y: z.z.number().int(),
    deltaX: z.z.number().int().describe("Pixels to scroll horizontally"),
    deltaY: z.z.number().int().describe("Pixels to scroll vertically")
  }),
  resolver: async ({ input: { x, y, deltaX, deltaY }, agent }) => {
    const webConnector = agent.require(BrowserConnector);
    const harness = webConnector.getHarness();
    await harness.scroll({ x, y, deltaX, deltaY });
  },
  render: ({ x, y, deltaX, deltaY }) => `\u2195 scroll (${deltaX}px, ${deltaY}px)`
});
const switchTabAction = createAction({
  name: "browser:tab:switch",
  description: "Switch to a tab that is already open",
  schema: z.z.object({
    index: z.z.number().int().describe("Index of tab to switch to")
  }),
  resolver: async ({ input: { index }, agent }) => {
    const webConnector = agent.require(BrowserConnector);
    const harness = webConnector.getHarness();
    await harness.switchTab({ index });
  },
  render: ({ index }) => `\u29C9 switch to tab ${index}`
});
const newTabAction = createAction({
  name: "browser:tab:new",
  description: "Open and switch to a new tab",
  schema: z.z.object({}),
  resolver: async ({ agent }) => {
    const webConnector = agent.require(BrowserConnector);
    const harness = webConnector.getHarness();
    await harness.newTab();
  },
  render: () => `\u229E open new tab`
});
const navigateAction = createAction({
  name: "browser:nav",
  description: "Navigate to a URL directly",
  schema: z.z.object({
    url: z.z.string().describe("URL to navigate to")
  }),
  resolver: async ({ input: { url }, agent }) => {
    const webConnector = agent.require(BrowserConnector);
    const harness = webConnector.getHarness();
    await harness.navigate(url);
  },
  render: ({ url }) => `\u26D3\uFE0E navigate to ${url}`
});
createAction({
  name: "browser:nav:back",
  description: "Go back",
  schema: z.z.object({}),
  resolver: async ({ agent }) => {
    const webConnector = agent.require(BrowserConnector);
    const harness = webConnector.getHarness();
    await harness.goBack();
  },
  render: () => `\u2190 navigate back`
});
createAction({
  name: "wait",
  description: "Wait for some time",
  schema: z.z.object({
    seconds: z.z.number()
  }),
  resolver: async ({ input: { seconds }, agent }) => {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
  },
  render: ({ seconds }) => `\u25F4 wait for ${seconds}s`
});
const agnosticWebActions = [
  newTabAction,
  switchTabAction,
  navigateAction,
  typeAction,
  keyboardEnterAction,
  keyboardTabAction,
  keyboardBackspaceAction,
  keyboardSelectAllAction
  //waitAction,
];
const coordWebActions = [
  clickCoordAction,
  mouseDoubleClickAction,
  mouseRightClickAction,
  scrollCoordAction,
  mouseDragAction
  //typeAction
];
const targetWebActions = [
  clickTargetAction,
  //typeAction,
  //clickTargetAndType,
  scrollTargetAction
];

const DEFAULT_BROWSER_OPTIONS = {
  headless: false,
  args: ["--disable-gpu", "--disable-blink-features=AutomationControlled"]
};
class BrowserProvider {
  activeBrowsers = {};
  logger;
  constructor() {
    this.logger = logger.child({ name: "browser_provider" });
  }
  static getInstance() {
    if (!globalThis.__magnitude__) {
      globalThis.__magnitude__ = {};
    }
    if (!globalThis.__magnitude__.browserProvider) {
      globalThis.__magnitude__.browserProvider = new BrowserProvider();
    }
    return globalThis.__magnitude__.browserProvider;
  }
  async _launchOrReuseBrowser(options) {
    console.info(`launching or reusing browser`)
    const hash = objectHash({
      ...options,
      logger: options.logger ? crypto$1.randomUUID() : ""
      // replace unserializable logger - use UUID to force re-instance in case different loggers provided
    });
    let activeBrowser;
    if (!(hash in this.activeBrowsers)) {
      this.logger.trace("Launching new browser");
      const launchPromise = playwright.chromium.launch({ ...DEFAULT_BROWSER_OPTIONS, ...options });
      activeBrowser = {
        browserPromise: launchPromise,
        activeContextsCount: 0
      };
      this.activeBrowsers[hash] = activeBrowser;
      const browser = await launchPromise;
      browser.on("disconnected", () => {
        delete this.activeBrowsers[hash];
      });
      return activeBrowser;
    } else {
      this.logger.trace("Browser with same launch options exists, reusing");
      return this.activeBrowsers[hash];
    }
  }
  async _createAndTrackContext(options) {
    const activeBrowserEntry = await this._launchOrReuseBrowser("launchOptions" in options ? options.launchOptions : {});
    const browser = await activeBrowserEntry.browserPromise;
    const context = await browser.newContext(options.contextOptions);
    const viewport = options.contextOptions?.viewport || { width: 1024, height: 768 };
    const deviceScaleFactor = options.contextOptions?.deviceScaleFactor || 1;
    context.on("page", async (page) => {
      const cdpSession = await page.context().newCDPSession(page);
      await this._applyEmulationSettings(cdpSession, viewport.width, viewport.height, deviceScaleFactor);
    });
    activeBrowserEntry.activeContextsCount++;
    context.on("close", async () => {
      activeBrowserEntry.activeContextsCount--;
      if (activeBrowserEntry.activeContextsCount <= 0 && browser.isConnected()) {
        await browser.close();
      }
    });
    return context;
  }
  async newContext(options) {
    if (process.env.MAGNTIUDE_PLAYGROUND) {
      this.logger.trace("MAGNITUDE_PLAYGROUND environment detected, applying playground launch options");
      const playgroundLaunchOptions = {
        args: [
          "--remote-debugging-port=9222",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ]
      };
      options = {
        launchOptions: playgroundLaunchOptions,
        contextOptions: options?.contextOptions
      };
    }

    console.info(options.instance)
    if (options) {
      console.info(`reached context`)

      if ("cdp" in options) {
        const browser = await playwright.chromium.connectOverCDP(options.cdp);
        return browser.newContext(options.contextOptions);
      } else if ('context' in options) {
        console.info(`reached context`)
        return options.context;
      } else if ("instance" in options) {
        return await options.instance.newContext(options.contextOptions);
      } else if ("launchOptions" in options) {
        this.logger.trace("Creating context with custom launch options");
        return await this._createAndTrackContext(options);
      } else {
        this.logger.trace("Creating context for default browser options");
        return await this._createAndTrackContext(options);
      }
    } else {
      this.logger.trace("Creating context for default browser options");
      return await this._createAndTrackContext({});
    }
  }
  async _applyEmulationSettings(cdpSession, width, height, deviceScaleFactor) {
    await cdpSession.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor,
      mobile: false,
      screenWidth: width,
      screenHeight: height,
      positionX: 0,
      positionY: 0,
      screenOrientation: { angle: 0, type: "portraitPrimary" }
    });
  }
}

async function retryOnError(fnToRetry, errorSubstrings, retryLimit, delayMs = 200) {
  let lastError;
  if (retryLimit < 0) {
    retryLimit = 0;
  }
  for (let attempt = 0; attempt <= retryLimit; attempt++) {
    try {
      return await fnToRetry();
    } catch (error) {
      lastError = error;
      const errorMessage = String(error?.message ?? error);
      const includesSubstring = errorSubstrings.some((substring) => errorMessage.includes(substring));
      if (includesSubstring) {
        if (attempt === retryLimit) {
          throw lastError;
        }
      } else {
        throw lastError;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw lastError;
}
function deepEquals(a, b, cache = /* @__PURE__ */ new WeakMap()) {
  if (a === b) {
    return true;
  }
  if (a == null || typeof a !== "object" || b == null || typeof b !== "object") {
    return false;
  }
  if (cache.has(a) && cache.get(a).has(b)) {
    return true;
  }
  if (!cache.has(a)) {
    cache.set(a, /* @__PURE__ */ new WeakSet());
  }
  cache.get(a).add(b);
  if (!cache.has(b)) {
    cache.set(b, /* @__PURE__ */ new WeakSet());
  }
  cache.get(b).add(a);
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i], cache)) {
        return false;
      }
    }
    return true;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!deepEquals(a[key], b[key], cache)) {
      return false;
    }
  }
  return true;
}

const DEFAULT_CLIENT = {
  provider: "moondream",
  options: {
    baseUrl: "https://api.moondream.ai/v1",
    apiKey: process.env.MOONDREAM_API_KEY
  }
};
const moondreamTargetingInstructions = `
Targets descriptions must be carefully chosen to be accurately picked up by Moondream, a small vision model.
Build a "minimal unique identifier" - a description that is as brief as possible that uniquely identifies the target on the page.
Use only the information needed, and prioritize in this order:
- specific text
- specific shapes and colors
- positional information
- high level information (Moondream cannot always understand high level concepts)
`;
class GroundingService {
  /**
   * Small, fast, vision agent to translate high level web actions to precise, executable actions.
   * Uses Moondream for pixel precision pointing.
   */
  config;
  info;
  logger;
  moondream;
  constructor(config) {
    const clientOptions = { ...DEFAULT_CLIENT.options, ...config.client?.options ?? {} };
    const client = { ...DEFAULT_CLIENT, ...config.client ?? {}, options: clientOptions };
    this.config = { ...config, client };
    this.info = { provider: "moondream", numCalls: 0 };
    this.logger = logger.child({ name: "agent.grounding" });
    this.moondream = new moondream.vl({ apiKey: this.config.client.options.apiKey, endpoint: this.config.client.options.baseUrl });
  }
  getInfo() {
    return this.info;
  }
  async locateTarget(screenshot, target) {
    return await retryOnError(
      async () => this._locateTarget(screenshot, target),
      ["429", "503", "524"],
      20,
      1e3
    );
  }
  async _locateTarget(screenshot, target) {
    const start = Date.now();
    const response = await this.moondream.point({
      image: { imageUrl: await screenshot.toBase64() },
      object: target
    });
    this.info.numCalls++;
    if (response.points.length > 1) {
      logger.warn({ points: response.points }, "Moondream returned multiple points for locateTarget");
      throw new Error(`Moondream returned multiple points (${response.points.length}), target '${target}' unclear`);
    }
    if (response.points.length === 0) {
      logger.warn("Moondream returned no points");
      throw new Error(`Moondream returned no points, target unclear`);
    }
    const relCoords = response.points[0];
    this.logger.trace(`locateTarget took ${Date.now() - start}ms`);
    const { width, height } = await screenshot.getDimensions();
    const pixelCoords = {
      x: relCoords.x * width,
      y: relCoords.y * height
    };
    return pixelCoords;
  }
}

class BrowserConnector {
  id = "web";
  harness;
  options;
  browser;
  context;
  logger;
  grounding;
  constructor(options = {}) {
    this.options = options;
    this.logger = logger.child({
      name: `connectors.${this.id}`
    });
    if (this.options.grounding) {
      this.grounding = new GroundingService({ client: this.options.grounding });
    }
  }
  requireGrounding() {
    if (!this.grounding) throw new Error("Grounding not configured on web connector");
    return this.grounding;
  }
  async onStart() {
    this.logger.info("Starting...");
    const dpr = process.env.DEVICE_PIXEL_RATIO ? parseInt(process.env.DEVICE_PIXEL_RATIO) : process.platform === "darwin" ? 2 : 1;
    const browserContextOptions = {
      viewport: { width: 1024, height: 768 },
      deviceScaleFactor: dpr,
      ...this.options.browser?.contextOptions
    };
    const browserOptions = this.options.browser;
    this.logger.info("Creating new browser context.");
    this.context = await BrowserProvider.getInstance().newContext({
      ...browserOptions,
      contextOptions: browserContextOptions
    });
    this.harness = new WebHarness(this.context, {
      virtualScreenDimensions: this.options.virtualScreenDimensions
    });
    await this.harness.start();
    this.logger.info("WebHarness started.");
    if (this.options.url) {
      this.logger.info(`Navigating to initial URL: ${this.options.url}`);
      await this.harness.navigate(this.options.url);
    }
    this.logger.info("Started successfully.");
  }
  async onStop() {
    this.logger.info("Stopping...");
    if (this.context) {
      await this.context.close();
      this.logger.info("Browser context closed.");
    }
    this.logger.info("Stopped successfully.");
  }
  getActionSpace() {
    if (this.grounding) {
      return [...targetWebActions, ...agnosticWebActions];
    } else {
      return [...coordWebActions, ...agnosticWebActions];
    }
  }
  // public get page(): Page {
  //     if (!this.harness || !this.harness.page) {
  //         throw new Error("WebInteractionConnector: Harness or Page is not available. Ensure onStart has completed.");
  //     }
  //     return this.harness.page;
  // }
  getHarness() {
    if (!this.harness) {
      throw new Error("WebInteractionConnector: Harness is not available. Ensure onStart has completed.");
    }
    return this.harness;
  }
  async captureCurrentState() {
    if (!this.harness || !this.harness.page) {
      throw new Error("WebInteractionConnector: Harness or Page is not available for capturing state.");
    }
    const [screenshot, tabs] = await Promise.all([
      this.harness.screenshot(),
      this.harness.retrieveTabState()
    ]);
    return { screenshot: await this.transformScreenshot(screenshot), tabs };
  }
  async transformScreenshot(screenshot) {
    if (this.options.virtualScreenDimensions) {
      return await screenshot.resize(this.options.virtualScreenDimensions.width, this.options.virtualScreenDimensions.height);
    } else {
      return screenshot;
    }
  }
  async getLastScreenshot() {
    return (await this.captureCurrentState()).screenshot;
  }
  async collectObservations() {
    const currentState = await this.captureCurrentState();
    const observations = [];
    const currentTabs = currentState.tabs;
    let tabInfo = "Open Tabs:\n";
    currentTabs.tabs.forEach((tab, index) => {
      tabInfo += `${index === currentTabs.activeTab ? "[ACTIVE] " : ""}${tab.title} (${tab.url})`;
    });
    observations.push(
      Observation.fromConnector(
        this.id,
        await this.transformScreenshot(currentState.screenshot),
        { type: "screenshot", limit: 3, dedupe: true }
      )
    );
    observations.push(
      Observation.fromConnector(
        this.id,
        tabInfo,
        { type: "tabinfo", limit: 1 }
      )
    );
    return observations;
  }
  async getInstructions() {
    if (this.grounding) {
      return moondreamTargetingInstructions;
    }
  }
}

function narrateAgent(agent) {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalInputTokenCost = 0;
  let totalOutputTokenCost = 0;
  agent.events.on("tokensUsed", (usage) => {
    totalInputTokens += usage.inputTokens;
    totalOutputTokens += usage.outputTokens;
    totalInputTokenCost += usage.inputCost ?? 0;
    totalOutputTokenCost += usage.outputCost ?? 0;
  });
  agent.events.on("start", () => {
    console.log(ansis.bold(ansis.blueBright(`\u25B6 [start] agent started`)));
  });
  agent.events.on("stop", () => {
    console.log(ansis.bold(ansis.blueBright(`\u25A0 [stop] agent stopped`)));
    if (totalInputTokenCost > 0 || totalOutputTokenCost > 0) {
      console.log(`  Total usage: ` + ansis.bold`${totalInputTokens}` + ` input tokens ($${totalInputTokenCost.toFixed(3)}) / ` + ansis.bold`${totalOutputTokens}` + ` output tokens ($${totalOutputTokenCost.toFixed(3)})`);
    } else {
      console.log(`  Total usage: ` + ansis.bold`${totalInputTokens}` + ` input tokens / ` + ansis.bold`${totalOutputTokens}` + ` output tokens`);
    }
  });
  agent.events.on("thought", (thought) => {
    console.log(ansis.gray`${thought}`);
  });
  agent.events.on("actStarted", (task, options) => {
    console.log(ansis.bold(ansis.cyanBright(`\u25C6 [act] ${task}`)));
  });
  agent.events.on("actionStarted", (action) => {
    const actionDefinition = agent.identifyAction(action);
    console.log(ansis.bold`  ${actionDefinition.render(action)}`);
  });
}
function narrateBrowserAgent(agent) {
  narrateAgent(agent);
  agent.browserAgentEvents.on("nav", (url) => {
    console.log(ansis.bold(ansis.cyanBright`⛓︎ [nav] ${url}`));
  });
  agent.browserAgentEvents.on("extractStarted", (instructions, schema) => {
    console.log(ansis.bold(ansis.cyanBright`⛏ [extract] ${instructions}`));
  });
  agent.browserAgentEvents.on("extractDone", (instructions, data) => {
    console.log(data);
  });
}

async function startBrowserAgent(options) {
  const { agentOptions, browserOptions } = buildDefaultBrowserAgentOptions({ agentOptions: options ?? {}, browserOptions: options ?? {} });
  const agent = new BrowserAgent({
    agentOptions,
    browserOptions
  });
  if (options?.narrate || process.env.MAGNITUDE_NARRATE) {
    narrateBrowserAgent(agent);
  }
  await agent.start();
  return agent;
}
class BrowserAgent extends Agent {
  browserAgentEvents = new EventEmitter();
  constructor({ agentOptions, browserOptions }) {
    super({
      ...agentOptions,
      connectors: [new BrowserConnector(browserOptions || {}), ...agentOptions?.connectors ?? []]
    });
  }
  get page() {
    return this.require(BrowserConnector).getHarness().page;
  }
  get context() {
    return this.require(BrowserConnector).getHarness().context;
  }
  async nav(url) {
    this.browserAgentEvents.emit("nav", url);
    await this.require(BrowserConnector).getHarness().navigate(url);
  }
  async extract(instructions, schema) {
    this.browserAgentEvents.emit("extractStarted", instructions, schema);
    const accessibilityTree = await this.page.accessibility.snapshot({ interestingOnly: true });
    const pageRepr = renderMinimalAccessibilityTree(accessibilityTree);
    const screenshot = await this.require(BrowserConnector).getHarness().screenshot();
    const data = await this.model.extract(instructions, schema, screenshot, pageRepr);
    this.browserAgentEvents.emit("extractDone", instructions, data);
    return data;
  }
  // async check(description: string): Promise<boolean> {
  //     //const screenshot = await this.require(BrowserConnector).getHarness().screenshot();
  //     return await this.macro.check(description, screenshot);
  // }
}

process.env.BAML_LOG = "off";
logging.setLogLevel("OFF");

exports.Agent = Agent;
exports.AgentError = AgentError;
exports.BrowserAgent = BrowserAgent;
exports.BrowserConnector = BrowserConnector;
exports.BrowserProvider = BrowserProvider;
exports.buildDefaultBrowserAgentOptions = buildDefaultBrowserAgentOptions;
exports.createAction = createAction;
exports.createId = createId;
exports.deepEquals = deepEquals;
exports.getCodebaseId = getCodebaseId;
exports.getMachineId = getMachineId;
exports.logger = logger;
exports.posthog = posthog;
exports.retryOnError = retryOnError;
exports.sendTelemetry = sendTelemetry;
exports.startBrowserAgent = startBrowserAgent;
