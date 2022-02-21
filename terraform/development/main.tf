

# Configure the LaunchDarkly provider
terraform {
  required_providers {
    launchdarkly = {
      source = "launchdarkly/launchdarkly"
      version = "~> 2.0.0"
    }
  }
  required_version = ">= 0.13"

}


module "launchdarkly_demo_project"{
  source = "../modules/launchdarkly"
  launchdarkly_access_token = var.access_token
  launchdarkly_project_key  = var.project_key
  launchdarkly_project_name = var.project_name
  launchdarkly_environment_key   = var.environment_key
  launchdarkly_environment_name  = var.environment_name
  launchdarkly_environment_color= var.environment_color
}


output "config"{
  depends_on=[module.launchdarkly_demo_project]
    value       = {
        clientId= "${module.launchdarkly_demo_project.client_side_id}",
        project= "${var.project_key}",
        environment= "${ var.environment_key}"
    } 
  sensitive=true
}

