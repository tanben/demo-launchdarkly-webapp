

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

output "client_side_id"{
  depends_on=[module.launchdarkly_demo_project]
  value = module.launchdarkly_demo_project.client_side_id
  sensitive = true
}