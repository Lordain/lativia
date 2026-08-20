import type {
    Service,
    ServiceFormData,
  } from "@/types/service";
  
  export function toServiceFormData(
    service:
      Service
  ): ServiceFormData {
    return {
      /*
       * Basic
       */
  
      slug:
        service.slug,
  
      title:
        service.title,
  
      shortDescription:
        service
          .shortDescription,
  
      description:
        service.description,
  
      category:
        service.category,
  
      icon:
        service.icon,
  
      price:
        service.price,
  
      duration:
        service.duration,
  
      requirements:
        service.requirements
          .join(", "),
  
      popular:
        service.popular,
  
      /*
       * Settings
       */
  
      serviceType:
        service.serviceType,
  
      launchPriority:
        service.launchPriority,
  
      serviceStatus:
        service.serviceStatus,
  
      /*
       * Eligibility
       */
  
      eligibilityMode:
        service
          .eligibilityMode,
  
      eligibilitySchema:
        service
          .eligibilitySchema,
  
      /*
       * Customer Form
       */
  
      formSchema:
        service.formSchema,
  
      /*
       * Execution
       */
  
      workspaceRequired:
        service
          .workspaceRequired,
  
      completionMode:
        service
          .completionMode,
  
      accessDurationDays:
        service
          .accessDurationDays,
  
      completionMilestones:
        service
          .completionMilestones,
  
      /*
       * Result
       */
  
      expectedOutcome:
      service
        .expectedOutcome ||
      service
        .resultType ||
      "",
    
    resultIsOfficial:
      service
        .resultIsOfficial,
    
    resultRequired:
      service
        .resultRequired,
    
    hasResultFile:
      service
        .resultDeliveryMode ===
        "email" ||
      service
        .resultDeliveryMode ===
        "email_and_workspace",
  
      /*
       * Refund
       */
  
      refundEligibleWhenFailed:
        service
          .refundEligibleWhenFailed,
    };
  }