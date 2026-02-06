package com.omnia.omnia.Controller;

import com.omnia.omnia.Entities.AidType;
import com.omnia.omnia.Service.AidTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/aid-types")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4300"})
public class AidTypeController {

    private final AidTypeService aidTypeService;

    @GetMapping
    public ResponseEntity<List<AidType>> getAllAidTypes() {
        return ResponseEntity.ok(aidTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AidType> getAidTypeById(@PathVariable UUID id) {
        return ResponseEntity.ok(aidTypeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AidType> createAidType(@RequestBody AidType aidType) {
        return new ResponseEntity<>(aidTypeService.create(aidType), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AidType> updateAidType(
            @PathVariable UUID id,
            @RequestBody AidType aidType) {
        return ResponseEntity.ok(aidTypeService.update(id, aidType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAidType(@PathVariable UUID id) {
        aidTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AidType>> getAidTypesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(aidTypeService.findByCategory(category));
    }

    @GetMapping("/active")
    public ResponseEntity<List<AidType>> getActiveAidTypes() {
        return ResponseEntity.ok(aidTypeService.findActive());
    }

    @PostMapping("/initialize")
    public ResponseEntity<String> initializeDefaultAidTypes() {
        aidTypeService.initializeDefaultAidTypes();
        return ResponseEntity.ok("Default aid types initialized successfully");
    }
}